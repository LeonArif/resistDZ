import { useEffect, useMemo, useState } from 'react'
import NationalDashboard from './pages/NationalDashboard'
import CityDashboard from './pages/CityDashboard'
import Simulation from './pages/Simulation'
import Navbar from './components/Navbar'

const FALLBACK_OPTIONS = {
  Pathogen_Name: [],
  Antibiotic_Tested: [],
  Continent: ['Asia', 'Europe', 'Latin America', 'North America', 'Africa / Middle East', 'Oceania'],
  Infection_Source: [],
  Patient_Age_Group: ['0 - 17', '18 - 30', '31 - 60', '61+'],
  Ward_Type: [],
}

const FIXED_AGE_GROUP_OPTIONS = ['0 - 17', '18 - 30', '31 - 60', '61+']

const FALLBACK_CLIMATE = {
  Asia: { avgTempWeekly: 25.0, humidityPct: 76 },
  Europe: { avgTempWeekly: 14.0, humidityPct: 68 },
  'Latin America': { avgTempWeekly: 24.0, humidityPct: 76 },
  'North America': { avgTempWeekly: 16.0, humidityPct: 62 },
  'Africa / Middle East': { avgTempWeekly: 30.0, humidityPct: 55 },
  Oceania: { avgTempWeekly: 22.0, humidityPct: 70 },
}

const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_PROD_API_URL = 'https://resist-dz-9r7m.vercel.app'

function isLocalUrl(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'
  } catch {
    return false
  }
}

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (envUrl && !isLocalUrl(envUrl)) {
    return envUrl.replace(/\/+$/, '')
  }

  // Always prefer deployed backend URL when env is missing/invalid/local.
  return DEFAULT_PROD_API_URL
}

function App() {
  const apiBaseUrl = useMemo(() => resolveApiBaseUrl(), [])
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedProvince, setSelectedProvince] = useState('Jawa Barat')
  const [selectedCity, setSelectedCity] = useState('')
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)

  const [dropdownOptions, setDropdownOptions] = useState(FALLBACK_OPTIONS)
  const [climateMap, setClimateMap] = useState(FALLBACK_CLIMATE)

  const [formData, setFormData] = useState({
    Pathogen_Name: '',
    Antibiotic_Tested: '',
    MIC_Value: '',
    Continent: FALLBACK_OPTIONS.Continent[0],
    Infection_Source: '',
    Patient_Age_Group: '',
    Ward_Type: '',
    Sanitation_Index: '',
    Year: CURRENT_YEAR,
    Avg_Temp_Weekly: FALLBACK_CLIMATE.Asia.avgTempWeekly,
    Humidity_Pct: FALLBACK_CLIMATE.Asia.humidityPct,
  })
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
    const climate = climateMap[continent] || FALLBACK_CLIMATE[continent]
    setFormData((prev) => ({
      ...prev,
      Continent: continent,
      Avg_Temp_Weekly: climate ? climate.avgTempWeekly : prev.Avg_Temp_Weekly,
      Humidity_Pct: climate ? climate.humidityPct : prev.Humidity_Pct,
      Year: CURRENT_YEAR,
    }))
  }

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/options`)
        const data = await response.json()
        if (!response.ok) {
          return
        }

        const nextOptions = {
          Pathogen_Name: data.options?.Pathogen_Name || [],
          Antibiotic_Tested: data.options?.Antibiotic_Tested || [],
          Continent: data.options?.Continent?.length ? data.options.Continent : FALLBACK_OPTIONS.Continent,
          Infection_Source: data.options?.Infection_Source || [],
          // Keep age groups fixed so frontend does not depend on dataset/options endpoint.
          Patient_Age_Group: FIXED_AGE_GROUP_OPTIONS,
          Ward_Type: data.options?.Ward_Type || [],
        }
        const nextClimateMap = {
          ...FALLBACK_CLIMATE,
          ...(data.climateByContinent || {}),
        }

        setDropdownOptions(nextOptions)
        setClimateMap(nextClimateMap)

        setFormData((prev) => {
          const continent = nextOptions.Continent.includes(prev.Continent)
            ? prev.Continent
            : nextOptions.Continent[0]
          const climate = nextClimateMap[continent] || FALLBACK_CLIMATE.Asia

          return {
            ...prev,
            Continent: continent,
            Avg_Temp_Weekly: climate.avgTempWeekly,
            Humidity_Pct: climate.humidityPct,
          }
        })
      } catch {
        // Use fallback options when endpoint is unavailable.
      }
    }

    loadOptions()
  }, [apiBaseUrl])

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

  const cityByProvince = {
    'Jawa Barat': [
      'Kota Bandung',
      'Kabupaten Bandung',
      'Kota Bogor',
      'Kota Cimahi',
      'Kota Purwakarta',
      'Kota Cirebon',
      'Kota Garut',
    ],
    'Jawa Tengah': ['Kota Semarang', 'Kota Surakarta', 'Kabupaten Banyumas', 'Kota Magelang'],
    'Jawa Timur': ['Kota Surabaya', 'Kota Malang', 'Kabupaten Sidoarjo', 'Kota Kediri'],
    DKI: ['Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'],
    Banten: ['Kota Tangerang', 'Kota Serang', 'Kabupaten Lebak'],
  }

  const handleProvinceChange = (provinceName) => {
    setSelectedProvince(provinceName)
    setSelectedCity('')
  }

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName)
    setIsCityModalOpen(false)
  }

  const activeCities = cityByProvince[selectedProvince] || ['Kota belum tersedia']

  return (
    <main className="min-h-screen bg-[#ececec] text-sm text-slate-900 md:text-base">
      <Navbar activeView={activeView} onChangeView={setActiveView} />

      <div className="mx-auto max-w-295 px-6 pb-10 md:px-14">

        {activeView === 'simulation' ? (
          <Simulation
            apiBaseUrl={apiBaseUrl}
            formData={formData}
            updateField={updateField}
            handleContinentChange={handleContinentChange}
            dropdownOptions={dropdownOptions}
            result={result}
            error={error}
            isLoading={isLoading}
            runPrediction={runPrediction}
          />
        ) : selectedCity ? (
          <CityDashboard
            cityName={selectedCity}
            provinceName={selectedProvince}
            onBackToNational={() => setSelectedCity('')}
          />
        ) : (
          <NationalDashboard
            selectedProvince={selectedProvince}
            onSelectProvince={handleProvinceChange}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            isCityModalOpen={isCityModalOpen}
            onCloseCityModal={() => setIsCityModalOpen(false)}
            cityOptions={activeCities}
            onSelectCity={handleCitySelect}
          />
        )}
      </div>
    </main>
  )
}

export default App
