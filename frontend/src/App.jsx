import { useMemo, useState } from 'react'
import './App.css'

const CONTINENT_OPTIONS = [
  'Asia',
  'Europe',
  'Latin America',
  'North America',
  'Africa / Middle East',
  'Oceania',
]

const CONTINENT_CLIMATE = {
  Asia: { avgTempWeekly: 25.0, humidityPct: 76 },
  Europe: { avgTempWeekly: 14.0, humidityPct: 68 },
  'Latin America': { avgTempWeekly: 24.0, humidityPct: 76 },
  'North America': { avgTempWeekly: 16.0, humidityPct: 62 },
  'Africa / Middle East': { avgTempWeekly: 30.0, humidityPct: 55 },
  Oceania: { avgTempWeekly: 22.0, humidityPct: 70 },
}

const CURRENT_YEAR = new Date().getFullYear()

function App() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000',
    []
  )

  const [formData, setFormData] = useState({
    Pathogen_Name: '',
    Antibiotic_Tested: '',
    MIC_Value: '',
    Continent: 'Asia',
    Infection_Source: '',
    Patient_Age_Group: '',
    Ward_Type: '',
    Sanitation_Index: '',
    Year: CURRENT_YEAR,
    Avg_Temp_Weekly: CONTINENT_CLIMATE.Asia.avgTempWeekly,
    Humidity_Pct: CONTINENT_CLIMATE.Asia.humidityPct,
  })
  const [health, setHealth] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContinentChange = (continent) => {
    const climate = CONTINENT_CLIMATE[continent]
    setFormData((prev) => ({
      ...prev,
      Continent: continent,
      Avg_Temp_Weekly: climate ? climate.avgTempWeekly : prev.Avg_Temp_Weekly,
      Humidity_Pct: climate ? climate.humidityPct : prev.Humidity_Pct,
      Year: CURRENT_YEAR,
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      'Pathogen_Name',
      'Antibiotic_Tested',
      'MIC_Value',
      'Continent',
      'Infection_Source',
      'Patient_Age_Group',
      'Ward_Type',
      'Sanitation_Index',
    ]

    for (const field of requiredFields) {
      const value = formData[field]
      if (value === '' || value === null || value === undefined) {
        return `Field ${field} wajib diisi.`
      }
    }
    return ''
  }

  const checkBackend = async () => {
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/health`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Health check gagal')
      setHealth(data)
    } catch (err) {
      setHealth(null)
      setError(err.message)
    }
  }

  const runPrediction = async () => {
    setError('')
    setResult(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      inputs: [
        {
          Pathogen_Name: formData.Pathogen_Name,
          Antibiotic_Tested: formData.Antibiotic_Tested,
          MIC_Value: Number(formData.MIC_Value),
          Year: Number(formData.Year),
          Continent: formData.Continent,
          Infection_Source: formData.Infection_Source,
          Patient_Age_Group: formData.Patient_Age_Group,
          Ward_Type: formData.Ward_Type,
          Avg_Temp_Weekly: Number(formData.Avg_Temp_Weekly),
          Humidity_Pct: Number(formData.Humidity_Pct),
          Sanitation_Index: Number(formData.Sanitation_Index),
        },
      ],
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Prediksi gagal')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="badge">resistDZ · AI Predictor</p>
        <h1>Frontend React + Backend Flask siap dipakai</h1>
        <p>
          Ini UI sementara untuk ngetes endpoint model. Nanti detail desainnya bisa
          kamu kasih, lalu saya polish full.
        </p>
      </section>

      <section className="panel">
        <h2>1) Cek koneksi backend</h2>
        <button onClick={checkBackend}>Check /health</button>
        {health && (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        )}
      </section>

      <section className="panel">
        <h2>2) Input Data Prediksi</h2>
        <p className="hint">Year otomatis dari tahun sekarang, Avg_Temp_Weekly dan Humidity_Pct otomatis dari Continent.</p>

        <div className="form-grid">
          <label>
            Pathogen_Name
            <input
              type="text"
              value={formData.Pathogen_Name}
              onChange={(event) => updateField('Pathogen_Name', event.target.value)}
              placeholder="Contoh: Staphylococcus aureus"
            />
          </label>

          <label>
            Antibiotic_Tested
            <input
              type="text"
              value={formData.Antibiotic_Tested}
              onChange={(event) => updateField('Antibiotic_Tested', event.target.value)}
              placeholder="Contoh: Amikacin"
            />
          </label>

          <label>
            MIC_Value
            <input
              type="number"
              step="any"
              value={formData.MIC_Value}
              onChange={(event) => updateField('MIC_Value', event.target.value)}
              placeholder="Contoh: 4"
            />
          </label>

          <label>
            Continent
            <select
              value={formData.Continent}
              onChange={(event) => handleContinentChange(event.target.value)}
            >
              {CONTINENT_OPTIONS.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </label>

          <label>
            Infection_Source
            <input
              type="text"
              value={formData.Infection_Source}
              onChange={(event) => updateField('Infection_Source', event.target.value)}
              placeholder="Contoh: Respiratory"
            />
          </label>

          <label>
            Patient_Age_Group
            <input
              type="text"
              value={formData.Patient_Age_Group}
              onChange={(event) => updateField('Patient_Age_Group', event.target.value)}
              placeholder="Contoh: 31 - 60"
            />
          </label>

          <label>
            Ward_Type
            <input
              type="text"
              value={formData.Ward_Type}
              onChange={(event) => updateField('Ward_Type', event.target.value)}
              placeholder="Contoh: Medicine ICU"
            />
          </label>

          <label>
            Sanitation_Index
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.Sanitation_Index}
              onChange={(event) => updateField('Sanitation_Index', event.target.value)}
              placeholder="0.00 - 1.00"
            />
          </label>

          <label>
            Year (otomatis)
            <input type="number" value={formData.Year} readOnly />
          </label>

          <label>
            Avg_Temp_Weekly (otomatis)
            <input type="number" value={formData.Avg_Temp_Weekly} readOnly />
          </label>

          <label>
            Humidity_Pct (otomatis)
            <input type="number" value={formData.Humidity_Pct} readOnly />
          </label>
        </div>

        <button onClick={runPrediction} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Kirim ke /predict'}
        </button>
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </section>

      {error && (
        <section className="panel error">
          <h2>Error</h2>
          <p>{error}</p>
        </section>
      )}

      <footer>
        <small>API Base URL: {apiBaseUrl}</small>
      </footer>
    </main>
  )
}

export default App
