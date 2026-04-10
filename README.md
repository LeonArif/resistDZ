# resistDZ

Setup awal project:
- Frontend: React + Vite
- Backend: Flask API untuk inferensi model AI

## Struktur Folder

```
resistDZ/
	frontend/                # React + Vite
	backend/
		app.py                 # Flask app
		requirements.txt
		models/                # opsional, taruh model di sini
```

## 1) Jalankan Backend Flask

Masuk folder backend, lalu install dependency:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Jalankan server:

```powershell
python app.py
```

Backend default di `http://127.0.0.1:5000`.

### Lokasi file model

`backend/app.py` akan mencari model di urutan ini:
1. `backend/models/amr_hgb_pipeline.joblib`
2. `resistDZ/amr_hgb_pipeline.joblib`
3. parent folder dari `resistDZ`
4. fallback: `amr_light_pipeline.joblib`
5. fallback: `amr_xgb_pipeline.joblib`

Dan label class di:
1. `backend/models/amr_label_classes.npy`
2. `resistDZ/amr_label_classes.npy`
3. parent folder dari `resistDZ`

Kalau mau path custom, pakai environment variable:

```powershell
$env:MODEL_PATH="C:\\path\\to\\amr_hgb_pipeline.joblib"
$env:LABEL_PATH="C:\\path\\to\\amr_label_classes.npy"
python app.py
```

### Deploy backend ke Vercel

Set Root Directory project backend di Vercel ke folder `backend`.
Konfigurasi `backend/vercel.json` sudah diarahkan langsung ke `app.py` (tanpa wrapper API terpisah).

Cek endpoint setelah deploy:
- `/`
- `/health`
- `/schema`
- `/predict`

## 2) Jalankan Frontend Vite

Masuk folder frontend:

```powershell
cd frontend
npm install
```

Opsional set URL backend:

```powershell
copy .env.example .env
```

Lalu jalankan:

```powershell
npm run dev
```

Frontend default di `http://localhost:5173`.

## Endpoint API

- `GET /health` -> cek status backend
- `GET /schema` -> contoh payload dan feature terdeteksi
- `POST /predict` -> prediksi

Contoh request `POST /predict`:

```json
{
	"inputs": [
		{
			"Age": 35,
			"Gender": "F",
			"WBC": 9.4
		}
	]
}
```

Catatan:
- Kolom dalam setiap object `inputs` harus sesuai fitur saat model training.
- Frontend saat ini masih versi sederhana untuk test koneksi API.