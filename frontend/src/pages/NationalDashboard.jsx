import indonesiaMap from '../assets/indonesia-map.svg'

// Koordinat disesuaikan dengan visual SVG peta Indonesia (837x331)
// Setiap titik menunjuk ke pusat/area representatif masing-masing provinsi
const provincePoints = [
	// ── SUMATERA (1–10) ──────────────────────────────────────────────────
	{ id:  1, name: 'Aceh',                       level: 'moderate', x:  '6%',   y: '18%' },
	{ id:  2, name: 'Sumatera Utara',              level: 'moderate', x:  '9%',   y: '30%' },
	{ id:  3, name: 'Sumatera Barat',              level: 'moderate', x: '14%', y: '43%' },
	{ id:  4, name: 'Riau',                        level: 'moderate', x: '14.5%', y: '36%' },
	{ id:  5, name: 'Kepulauan Riau',              level: 'low',      x: '20%',   y: '27%' },
	{ id:  6, name: 'Jambi',                       level: 'high',     x: '18%', y: '47%' },
	{ id:  7, name: 'Bengkulu',                    level: 'moderate', x: '17%',   y: '55%' },
	{ id:  8, name: 'Sumatera Selatan',            level: 'moderate', x: '22%', y: '56%' },
	{ id:  9, name: 'Kepulauan Bangka Belitung',   level: 'low',      x: '22.5%', y: '49%' },
	{ id: 10, name: 'Lampung',                     level: 'moderate', x: '23%',   y: '62%' },

	// ── JAWA (11–16) — sudah OK ───────────────────────────────────────────
	{ id: 11, name: 'Banten',                      level: 'moderate', x: '24.5%', y: '66%' },
	{ id: 12, name: 'DKI Jakarta',                 level: 'moderate', x: '27.5%', y: '62%' },
	{ id: 13, name: 'Jawa Barat',                  level: 'critical', x: '30%',   y: '70%' },
	{ id: 14, name: 'Jawa Tengah',                 level: 'high',     x: '35%',   y: '65%' },
	{ id: 15, name: 'DI Yogyakarta',               level: 'high',     x: '36%',   y: '73%' },
	{ id: 16, name: 'Jawa Timur',                  level: 'high',     x: '40.5%', y: '64%' },

	// ── KALIMANTAN (17–21) ───────────────────────────────────────────────
	{ id: 17, name: 'Kalimantan Barat',            level: 'moderate', x: '31%',   y: '41%' },
	{ id: 18, name: 'Kalimantan Tengah',           level: 'moderate', x: '40%',   y: '43%' },
	{ id: 19, name: 'Kalimantan Selatan',          level: 'high',     x: '40%',   y: '50%' },
	{ id: 20, name: 'Kalimantan Timur',            level: 'moderate', x: '48%',   y: '39%' },
	{ id: 21, name: 'Kalimantan Utara',            level: 'moderate', x: '50%',   y: '27%' },

	// ── BALI & NUSA TENGGARA (22–24) ─────────────────────────────────────
	{ id: 22, name: 'Bali',                        level: 'high',     x: '45%',   y: '76%' },
	{ id: 23, name: 'Nusa Tenggara Barat',         level: 'high',     x: '49%',   y: '81%' },
	{ id: 24, name: 'Nusa Tenggara Timur',         level: 'low',      x: '55.5%', y: '80%' },

	// ── SULAWESI (25–30) ─────────────────────────────────────────────────
	{ id: 25, name: 'Sulawesi Utara',              level: 'moderate', x: '62%', y: '34%' },
	{ id: 26, name: 'Gorontalo',                   level: 'high',     x: '57%',   y: '41%' },
	{ id: 27, name: 'Sulawesi Tengah',             level: 'high',     x: '56.5%', y: '49%' },
	{ id: 28, name: 'Sulawesi Barat',              level: 'moderate', x: '52.5%', y: '56%' },
	{ id: 29, name: 'Sulawesi Selatan',            level: 'moderate', x: '54.5%', y: '63%' },
	{ id: 30, name: 'Sulawesi Tenggara',           level: 'moderate', x: '58.5%', y: '60%' },

	// ── MALUKU (31–32) ───────────────────────────────────────────────────
	{ id: 31, name: 'Maluku Utara',                level: 'low',      x: '70%',   y: '38%' },
	{ id: 32, name: 'Maluku',                      level: 'low',      x: '71%',   y: '55%' },

	// ── PAPUA (33–38 display, tapi hanya 6 titik utama) ──────────────────
	// Menggunakan angka terpisah agar tidak bentrok — tampil sebagai label nama
	{ id: 33, name: 'Papua Barat',                 level: 'low',      x: '92%',   y: '55%' },
	{ id: 34, name: 'Papua Barat Daya',            level: 'low',      x: '84%',   y: '64%' },
	{ id: 35, name: 'Papua Pegunungan',            level: 'low',      x: '80%',   y: '49%' },
	{ id: 36, name: 'Papua',                       level: 'low',      x: '87%',   y: '50%' },
	{ id: 37, name: 'Papua Selatan',               level: 'low',      x: '93%',   y: '68%' },
	{ id: 38, name: 'Papua Tengah',                level: 'low',      x: '89%',   y: '59%' },
]

// Warna dot per level severity
const mapDotStyle = {
	critical: 'bg-[#cb4f15] text-white ring-2 ring-[#cb4f15]/40',
	high:     'bg-[#e7904e] text-white',
	moderate: 'bg-[#d9d9d9] text-[#cb4f15]',
	low:      'bg-[#c8b0b0] text-white',
}

const provinceDetails = {
	'Jawa Barat': {
		resistantBacteria: 'Staphylococcus aureus',
		resistantPct: 20,
		trend: [72, 55, 50, 57, 53, 59, 49, 45],
	},
	'Jawa Tengah': {
		resistantBacteria: 'Klebsiella pneumoniae',
		resistantPct: 27,
		trend: [66, 61, 59, 54, 57, 51, 47, 44],
	},
	'Jawa Timur': {
		resistantBacteria: 'E. coli',
		resistantPct: 23,
		trend: [69, 63, 58, 56, 54, 51, 47, 46],
	},
	'DKI Jakarta': {
		resistantBacteria: 'P. aeruginosa',
		resistantPct: 18,
		trend: [75, 72, 68, 66, 64, 61, 57, 54],
	},
	Banten: {
		resistantBacteria: 'A. baumannii',
		resistantPct: 16,
		trend: [64, 59, 61, 55, 52, 50, 48, 46],
	},
}

const statCards = [
	{ title: 'AMR Rate',     value: 'High',      delta: '+2%',      icon: '▰', emphasis: true },
	{ title: 'Temperature',  value: '28.5°C',    delta: '+1.2',     icon: '◔' },
	{ title: 'Humidity',     value: '65%',        delta: '-2',       icon: '◌' },
	{ title: 'Sanitation',   value: '78/100',     delta: '+3',       icon: '▤' },
	{ title: 'Update Time',  value: '2:45:01 PM', delta: 'Live',     icon: '◷' },
]

function NationalDashboard({
	selectedProvince,
	onSelectProvince,
	onOpenCityModal,
	isCityModalOpen,
	onCloseCityModal,
	cityOptions,
	onSelectCity,
}) {
	const detail = provinceDetails[selectedProvince] || provinceDetails['Jawa Barat']

	return (
		<>
			{/* ── Stat Cards ───────────────────────────────────────── */}
			<section className="grid gap-4 md:grid-cols-5">
				{statCards.map((card) => (
					<article
						key={card.title}
						className={`rounded-xl border border-[#c7c7c7] p-5 text-center shadow-sm ${card.emphasis ? 'bg-[#cb4f15] text-white' : 'bg-[#f3f3f3]'}`}
					>
						<p className="text-xl">{card.icon}</p>
						<p className={`mt-2 text-sm ${card.emphasis ? 'text-orange-100' : 'text-[#cb4f15]'}`}>{card.title}</p>
						<p className="mt-1 text-2xl font-semibold leading-tight">{card.value}</p>
						<p className={`mt-1 text-sm ${card.emphasis ? 'text-orange-100' : 'text-[#cb4f15]'}`}>{card.delta}</p>
					</article>
				))}
			</section>

			{/* ── Map + Detail ─────────────────────────────────────── */}
			<section className="mt-6 grid gap-6 lg:grid-cols-[1fr_330px]">

				{/* Map card */}
				<article className="rounded-xl border border-[#bdbdbd] bg-[#f3f3f3] p-5 shadow-sm">
					<h2 className="text-center text-3xl font-semibold">AMR Distribution Map by Province in Indonesia</h2>
					<p className="mt-2 text-center text-sm text-slate-600">[Zoom In +] [Zoom Out -] [Reset View] [Fullscreen]</p>

					<div className="relative mt-5 h-90 rounded-2xl bg-[radial-gradient(circle_at_top_left,#f8e4c8_0,#efe9e1_35%,#e2d7d7_100%)] p-4">

						{/* Peta SVG */}
						<img
							src={indonesiaMap}
							alt="Indonesia map"
							className="absolute inset-x-6 bottom-2 top-16 h-auto w-[calc(100%-3rem)] object-contain"
						/>

						<div className="absolute left-4 top-3 text-xs text-slate-500">
							Klik titik provinsi untuk melihat detail.
						</div>

						{/* Province dots */}
						{provincePoints.map((province) => (
							<button
								key={province.id}
								type="button"
								onClick={() => onSelectProvince(province.name)}
								title={province.name}
								aria-label={province.name}
								className={[
									'absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2',
									'place-content-center rounded-full text-[9px] font-bold shadow',
									'transition-transform hover:scale-125 active:scale-95',
									mapDotStyle[province.level] || mapDotStyle.low,
									selectedProvince === province.name
										? 'z-10 scale-125 ring-2 ring-slate-800 ring-offset-1'
										: '',
								].join(' ')}
								style={{ left: province.x, top: province.y }}
							>
								{province.id}
							</button>
						))}

						{/* Legend */}
						<div className="absolute bottom-2 right-3 flex flex-col gap-1 rounded-lg bg-white/70 px-2 py-1.5 text-[9px] backdrop-blur-sm">
							{[
								{ level: 'critical', label: 'Critical' },
								{ level: 'high',     label: 'High' },
								{ level: 'moderate', label: 'Moderate' },
								{ level: 'low',      label: 'Low' },
							].map(({ level, label }) => (
								<span key={level} className="flex items-center gap-1">
									<span className={`inline-block h-2 w-2 rounded-full ${mapDotStyle[level].split(' ')[0]}`} />
									{label}
								</span>
							))}
						</div>
					</div>
				</article>

				{/* Province detail sidebar */}
				<aside className="rounded-xl border border-[#bdbdbd] bg-[#f3f3f3] p-6 shadow-sm">
					<p className="text-base text-slate-600">Province Name</p>
					<h3 className="text-3xl font-semibold">{selectedProvince}</h3>

					<button
						type="button"
						className="mt-5 w-full rounded-full bg-[#deb1b4] px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-[#d79ea3]"
						onClick={onOpenCityModal}
					>
						⊕ City Detail
					</button>

					<p className="mt-4 text-sm italic text-slate-500">Click above to see bacterial details by city.</p>

					<div className="mt-5 rounded-full bg-[#f7f7f7] px-4 py-2 text-center text-sm text-slate-500 shadow-inner">
						<span className="font-semibold text-[#cf7b2f]">{detail.resistantPct}%</span> {detail.resistantBacteria}
					</div>

					<div className="mt-4 h-42.5 rounded-xl border border-dashed border-[#cfcfcf] bg-[#fbfbfb] px-4 py-3">
						<div className="relative h-full">
							{[25, 50, 75].map((line) => (
								<div
									key={line}
									className="absolute left-0 right-0 border-t border-dashed border-[#d9d9d9]"
									style={{ top: `${line}%` }}
								/>
							))}
							<svg viewBox="0 0 280 110" className="absolute inset-0 h-full w-full">
								<polyline
									fill="none"
									stroke="#d79ea3"
									strokeWidth="3"
									points={detail.trend.map((point, index) => `${(index / 7) * 280},${110 - point}`).join(' ')}
								/>
								{detail.trend.map((point, index) => (
									<circle key={`${point}-${index}`} cx={(index / 7) * 280} cy={110 - point} r="3" fill="#c6777f" />
								))}
							</svg>
						</div>
					</div>

					<p className="mt-4 text-center text-base italic text-slate-600">Bacterial Distribution in the Last 1 Year</p>
				</aside>
			</section>

			{/* ── City Modal ───────────────────────────────────────── */}
			{isCityModalOpen && (
				<div className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 p-4">
					<div className="w-[92vw] max-w-150 rounded-3xl bg-[#efefef] p-8 shadow-xl">
						<h3 className="text-center text-3xl font-semibold">Select City</h3>
						<p className="mt-2 text-center text-base text-slate-600">View detailed AMR insights by city</p>

						<div className="mt-6 rounded-xl bg-[#f7f7f7] p-3 text-slate-600">Name ↓</div>
						<div className="mt-2 max-h-70 overflow-y-auto rounded-xl border border-[#d7d7d7] bg-[#f4f4f4]">
							{cityOptions.map((city) => (
								<button
									key={city}
									type="button"
									onClick={() => onSelectCity(city)}
									className="flex w-full items-center justify-between border-b border-[#e0e0e0] px-5 py-3 text-left text-base text-slate-700 transition hover:bg-[#ececec]"
								>
									<span>{city}</span>
									<span className="text-slate-400">⋮</span>
								</button>
							))}
						</div>

						<div className="mt-6 flex justify-end">
							<button
								type="button"
								className="rounded-xl border border-[#c6c6c6] bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
								onClick={onCloseCityModal}
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default NationalDashboard