const summaryCards = [
	{ title: 'Participating Hospitals', value: '64', subtitle: 'Reporting AMR' },
	{ title: 'Detected Cases', value: '4.097', subtitle: 'Reported cases' },
	{ title: 'AMR Rate', value: '4.097', subtitle: 'City-level resistance rate' },
]

const antibioticBars = [
	{ name: 'Carbapenem', width: '96%', color: 'bg-[#be95d8]' },
	{ name: '3rd-Gen Cephalosporin', width: '74%', color: 'bg-[#c0b8dd]' },
	{ name: 'MRSA', width: '58%', color: 'bg-[#eacbcc]' },
]

const bacteriaRows = [
	{ name: 'S. aureus', value: '28.6%' },
	{ name: 'K. pneumoniae', value: '42.9%' },
	{ name: 'E. coli', value: '28.6%' },
	{ name: 'A. baumannii', value: '28.6%' },
	{ name: 'P. aeruginosa', value: '14.3%' },
	{ name: 'Shigella spp.', value: '14.3%' },
]

const hospitalRows = [
	{ hospital: 'RS Hasan Sadikin', city: 'Bandung', amrRate: '62%', risk: 'High', pathogen: 'Carbapenem' },
	{ hospital: 'RS Al Islam', city: 'Bandung', amrRate: '54%', risk: 'Moderate', pathogen: 'Penicillin' },
	{ hospital: 'RS Santo Borromeus', city: 'Bandung', amrRate: '47%', risk: 'Moderate', pathogen: '3rd-Gen Cephalosporin' },
	{ hospital: 'RS Immanuel', city: 'Bandung', amrRate: '39%', risk: 'Low', pathogen: 'MRSA' },
]

const riskClass = {
	High: 'bg-[#f6ccb9] text-[#bf4d0f]',
	Moderate: 'bg-[#f8e3c4] text-[#be7f20]',
	Low: 'bg-[#d3f4db] text-[#18814f]',
}

function CityDashboard({ cityName, provinceName, onBackToNational }) {
	return (
		<section>
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-3xl font-semibold">AMR in {cityName}</h2>
				<button
					type="button"
					onClick={onBackToNational}
					className="rounded-xl border border-[#c6c6c6] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
				>
					← Back to National Dashboard
				</button>
			</div>

			<div className="grid items-start gap-4 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.85fr]">
				{summaryCards.map((card) => (
					<article key={card.title} className="rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-5 shadow-sm">
						<p className="text-lg font-semibold leading-tight">{card.title}</p>
						<p className="mt-3 text-4xl font-bold leading-tight">{card.value}</p>
						<p className="mt-2 text-sm italic text-slate-500">{card.subtitle}</p>
					</article>
				))}

				<article className="rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-5 shadow-sm">
					<h3 className="text-3xl font-semibold leading-tight">Top 10 Most Resistant Bacteria</h3>
					<p className="mt-1 text-center text-base text-slate-600">In {provinceName} · Last 12 Months</p>

					<div className="mt-4 grid grid-cols-[170px_1fr] gap-4">
						<div className="relative mx-auto h-40 w-40 rounded-full bg-[conic-gradient(#e5b8bb_0_42%,#d798a5_42%_60%,#c5afe1_60%_80%,#f2b74e_80%_94%,#eca10f_94%_100%)]">
							<div className="absolute inset-5 grid place-content-center rounded-full bg-[#f3f3f3] text-center">
								<p className="text-xs text-slate-500">Total Value</p>
								<p className="text-3xl font-semibold">72</p>
							</div>
						</div>

						<div className="text-sm">
							<div className="grid grid-cols-[1fr_auto] border-b border-[#d6d6d6] pb-1 text-slate-500">
								<span>Label</span>
								<span>%</span>
							</div>
							{bacteriaRows.map((row, index) => (
								<div key={row.name} className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3">
									<span className="flex items-center gap-2 text-slate-700">
										<span className={`h-3 w-3 rounded-full ${['bg-[#c5afe1]', 'bg-[#e5b8bb]', 'bg-[#d798a5]', 'bg-[#f2b74e]', 'bg-[#eca10f]', 'bg-[#cc9ce0]'][index]}`} />
										{row.name}
									</span>
									<span className="font-semibold text-slate-700">{row.value}</span>
								</div>
							))}
						</div>
					</div>
				</article>
			</div>

				<div className="mt-5 grid items-start gap-4 lg:grid-cols-[1.65fr_1fr]">
				<article className="rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-6 shadow-sm">
						<h3 className="text-2xl font-semibold leading-tight">Top 3 Most Effective Antibiotics</h3>
					<p className="mt-2 text-base text-slate-600">{cityName} · Last 12 Months</p>

					<div className="mt-8 space-y-4">
						{antibioticBars.map((bar) => (
							<div key={bar.name}>
								<div className="h-9 rounded-r-lg rounded-tl-none rounded-bl-none bg-[#d9d9d9]">
									<div className={`flex h-full items-center justify-end rounded-r-lg px-3 text-sm font-medium text-slate-700 ${bar.color}`} style={{ width: bar.width }}>
										{bar.name}
									</div>
								</div>
							</div>
						))}
					</div>
				</article>

				<article className="rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-5 shadow-sm">
					<h3 className="text-xl font-semibold">Quick Summary</h3>
					<ul className="mt-4 space-y-2 text-base text-slate-700">
						<li>• AMR rate naik 2.1% dibanding kuartal lalu.</li>
						<li>• Dominasi strain: Klebsiella pneumoniae.</li>
						<li>• ICU dan Emergency jadi unit paling kritikal.</li>
						<li>• Intervensi sanitasi berpotensi turunkan risiko.</li>
					</ul>
				</article>
			</div>

			<article className="mt-5 rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-5 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 className="text-2xl font-semibold">Hospital AMR Table</h3>
						<p className="mt-1 text-base text-slate-500">Aggregated AMR data from participating hospitals in {cityName}.</p>
					</div>
					<button className="rounded-lg bg-[#1f6feb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a61cf]">+ Add new CTA</button>
				</div>

				<div className="mt-4 overflow-x-auto rounded-xl border border-[#dadada]">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-[#ececec] text-slate-500">
							<tr>
								<th className="px-4 py-3">Hospital Name</th>
								<th className="px-4 py-3">City</th>
								<th className="px-4 py-3">AMR Rate</th>
								<th className="px-4 py-3">Cases</th>
								<th className="px-4 py-3">Risk Level</th>
								<th className="px-4 py-3">Top Pathogen</th>
							</tr>
						</thead>
						<tbody>
							{hospitalRows.map((row) => (
								<tr key={row.hospital} className="border-t border-[#e3e3e3]">
									<td className="px-4 py-3 font-medium text-slate-700">{row.hospital}</td>
									<td className="px-4 py-3 text-slate-600">{row.city}</td>
									<td className="px-4 py-3 font-semibold text-slate-700">{row.amrRate}</td>
									<td className="px-4 py-3 text-slate-600">Regular text column</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskClass[row.risk]}`}>{row.risk}</span>
									</td>
									<td className="px-4 py-3 text-slate-700">{row.pathogen}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</article>
		</section>
	)
}

export default CityDashboard
