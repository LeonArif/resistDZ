from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

MODEL_CANDIDATES = [
    BASE_DIR / "models" / "amr_xgb_pipeline.joblib",
    PROJECT_ROOT / "amr_xgb_pipeline.joblib",
    PROJECT_ROOT.parent / "amr_xgb_pipeline.joblib",
]
DATASET_CANDIDATES = [
    BASE_DIR / "dataset" / "dataset_v2_full_features.csv",
    PROJECT_ROOT / "dataset_v2_full_features.csv",
    PROJECT_ROOT.parent / "dataset_v2_full_features.csv",
]
LABEL_CANDIDATES = [
    BASE_DIR / "models" / "amr_label_classes.npy",
    PROJECT_ROOT / "amr_label_classes.npy",
    PROJECT_ROOT.parent / "amr_label_classes.npy",
]


def _find_existing_file(candidates: list[Path]) -> Path | None:
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


MODEL_PATH = os.getenv("MODEL_PATH")
LABEL_PATH = os.getenv("LABEL_PATH")

resolved_model_path = Path(MODEL_PATH).resolve() if MODEL_PATH else _find_existing_file(MODEL_CANDIDATES)
resolved_label_path = Path(LABEL_PATH).resolve() if LABEL_PATH else _find_existing_file(LABEL_CANDIDATES)
resolved_dataset_path = _find_existing_file(DATASET_CANDIDATES)

if not resolved_model_path:
    raise FileNotFoundError(
        "Model file tidak ditemukan. Taruh amr_xgb_pipeline.joblib di backend/models "
        "atau set environment variable MODEL_PATH."
    )

pipeline = joblib.load(resolved_model_path)

if resolved_label_path:
    label_classes = np.load(resolved_label_path, allow_pickle=True)
else:
    label_classes = None


def _build_dataset_options() -> dict[str, Any]:
    if not resolved_dataset_path:
        return {"options": {}, "climate_by_continent": {}}

    try:
        df = pd.read_csv(resolved_dataset_path)
    except Exception:
        return {"options": {}, "climate_by_continent": {}}

    categorical_columns = [
        "Pathogen_Name",
        "Antibiotic_Tested",
        "Continent",
        "Infection_Source",
        "Patient_Age_Group",
        "Ward_Type",
    ]

    options: dict[str, list[str]] = {}
    for column in categorical_columns:
        if column not in df.columns:
            options[column] = []
            continue

        values = (
            df[column]
            .dropna()
            .astype(str)
            .str.strip()
            .replace("", np.nan)
            .dropna()
            .unique()
            .tolist()
        )
        options[column] = sorted(values)

    climate_by_continent: dict[str, dict[str, float]] = {}
    if {"Continent", "Avg_Temp_Weekly", "Humidity_Pct"}.issubset(df.columns):
        grouped = (
            df[["Continent", "Avg_Temp_Weekly", "Humidity_Pct"]]
            .dropna(subset=["Continent"])
            .groupby("Continent", as_index=True)
            .agg({"Avg_Temp_Weekly": "mean", "Humidity_Pct": "mean"})
        )
        for continent, row in grouped.iterrows():
            climate_by_continent[str(continent)] = {
                "avgTempWeekly": round(float(row["Avg_Temp_Weekly"]), 2),
                "humidityPct": round(float(row["Humidity_Pct"]), 2),
            }

    return {"options": options, "climate_by_continent": climate_by_continent}


DATASET_LOOKUP = _build_dataset_options()

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health() -> Any:
    return jsonify(
        {
            "status": "ok",
            "model_path": str(resolved_model_path),
            "label_path": str(resolved_label_path) if resolved_label_path else None,
            "dataset_path": str(resolved_dataset_path) if resolved_dataset_path else None,
        }
    )


@app.get("/options")
def options() -> Any:
    return jsonify(
        {
            "dataset_path": str(resolved_dataset_path) if resolved_dataset_path else None,
            "options": DATASET_LOOKUP["options"],
            "climateByContinent": DATASET_LOOKUP["climate_by_continent"],
        }
    )


@app.get("/schema")
def schema() -> Any:
    feature_names = getattr(pipeline, "feature_names_in_", None)
    return jsonify(
        {
            "features": feature_names.tolist() if feature_names is not None else [],
            "example_payload": {
                "inputs": [
                    {
                        "Pathogen_Name": "Staphylococcus aureus",
                        "Antibiotic_Tested": "Amikacin",
                        "MIC_Value": 4.0,
                        "Year": 2026,
                        "Continent": "Asia",
                        "Infection_Source": "Respiratory",
                        "Patient_Age_Group": "31 - 60",
                        "Ward_Type": "Medicine ICU",
                        "Avg_Temp_Weekly": 25.0,
                        "Humidity_Pct": 76,
                        "Sanitation_Index": 0.72,
                    }
                ]
            },
        }
    )


@app.post("/predict")
def predict() -> Any:
    payload = request.get_json(silent=True) or {}
    inputs = payload.get("inputs")

    if not isinstance(inputs, list) or not inputs:
        return jsonify({"error": "Body JSON harus punya key 'inputs' berupa list object."}), 400

    try:
        frame = pd.DataFrame(inputs)
        pred_ids = pipeline.predict(frame)
        pred_ids = np.asarray(pred_ids, dtype=int)

        if label_classes is not None:
            predictions = [str(label_classes[i]) for i in pred_ids]
        else:
            predictions = pred_ids.astype(str).tolist()

        response = {
            "predictions": predictions,
            "prediction_ids": pred_ids.tolist(),
            "count": len(predictions),
        }
        return jsonify(response)
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": f"Gagal prediksi: {exc}"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
