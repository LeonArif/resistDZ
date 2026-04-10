function Simulation({
	formData,
	updateField,
	handleContinentChange,
	dropdownOptions,
	result,
	error,
	isLoading,
	runPrediction,
}) {
	const predictionRaw = result?.predictions?.[0] || ''
	const hasPrediction = Boolean(predictionRaw)

	const getTone = (label) => {
		const value = label.toLowerCase()
		if (value.includes('intermediate')) return 'intermediate'
		if (value.includes('resistant') || value.includes('high')) return 'resistant'
		if (value.includes('susceptible') || value.includes('low')) return 'susceptible'
		return 'susceptible'
	}

	const tone = hasPrediction ? getTone(predictionRaw) : 'susceptible'
	const predictionLabel = hasPrediction ? predictionRaw : 'Low Resistance'
	const showEmptyDefault = !isLoading && !hasPrediction

	const toneStyle = {
		susceptible: {
			banner: 'bg-[#2f6f12] text-white',
			outline: 'border-[#3f7b2e]',
			icon: '✓',
			iconColor: 'border-[#3f7b2e] text-[#3f7b2e]',
			textColor: 'text-[#2f6f12]',
			message: 'Early warning signals detected. No outbreak, but risk increasing',
		},
		intermediate: {
			banner: 'bg-[#a67c00] text-white',
			outline: 'border-[#b08900]',
			icon: '•',
			iconColor: 'border-[#b08900] text-[#8c6700]',
			textColor: 'text-[#8c6700]',
			message: 'Intermediate signal detected. Keep close monitoring and prevention measures active',
		},
		resistant: {
			banner: 'bg-[#9f1239] text-white',
			outline: 'border-[#a11f45]',
			icon: '!',
			iconColor: 'border-[#a11f45] text-[#a11f45]',
			textColor: 'text-[#8b143a]',
			message: 'Resistant signal detected, immediate intervention required',
		},
	}

	const activeTone = toneStyle[tone]

	return (
		<section className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
			<div className="flex h-full flex-col gap-3">
				<article className="flex-1 rounded-xl border border-[#bbbbbb] bg-[#f3f3f3] p-6 shadow-sm">
					<h2 className="text-3xl font-semibold">Prediction Input</h2>
					<p className="mt-2 text-base text-slate-600">Enter key parameters to generate AMR predictions.</p>

					<div className="mt-7 grid gap-4 md:grid-cols-2">
						<label className="flex flex-col gap-2 text-sm font-semibold">
							Pathogen Name
							<input
								type="text"
								value={formData.Pathogen_Name}
								onChange={(event) => updateField('Pathogen_Name', event.target.value)}
								placeholder="Staphylococcus aureus"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Antibiotic Tested
							<input
								type="text"
								value={formData.Antibiotic_Tested}
								onChange={(event) => updateField('Antibiotic_Tested', event.target.value)}
								placeholder="Amikacin"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							MIC Value
							<input
								type="number"
								step="any"
								value={formData.MIC_Value}
								onChange={(event) => updateField('MIC_Value', event.target.value)}
								placeholder="4"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Continent
							<select
								value={formData.Continent}
								onChange={(event) => handleContinentChange(event.target.value)}
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none"
							>
								{dropdownOptions.Continent.map((continent) => (
									<option key={continent} value={continent}>
										{continent}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Infection Source
							<input
								type="text"
								value={formData.Infection_Source}
								onChange={(event) => updateField('Infection_Source', event.target.value)}
								placeholder="Respiratory"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Patient Age Group
							<select
								value={formData.Patient_Age_Group}
								onChange={(event) => updateField('Patient_Age_Group', event.target.value)}
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none"
							>
								<option value="">Pilih Age Group</option>
								{dropdownOptions.Patient_Age_Group.map((item) => (
									<option key={item} value={item}>
										{item}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Ward Type
							<input
								type="text"
								value={formData.Ward_Type}
								onChange={(event) => updateField('Ward_Type', event.target.value)}
								placeholder="Medicine ICU"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>

						<label className="flex flex-col gap-2 text-sm font-semibold">
							Sanitation Index
							<input
								type="number"
								step="0.01"
								min="0"
								max="1"
								value={formData.Sanitation_Index}
								onChange={(event) => updateField('Sanitation_Index', event.target.value)}
								placeholder="0.00 - 1.00"
								className="rounded-lg bg-[#d9d9d9] px-4 py-2 text-base outline-none placeholder:text-slate-500"
							/>
						</label>
					</div>

					{error && <p className="mt-3 rounded-lg bg-[#fdecec] px-4 py-2 text-sm text-[#a03535]">{error}</p>}
				</article>

				<button
					type="button"
					className="w-full rounded-lg bg-[#deb1b4] px-4 py-3 text-xl font-semibold transition hover:bg-[#d79ea3]"
					onClick={runPrediction}
					disabled={isLoading}
				>
					{isLoading ? 'Memproses...' : 'Generate Prediction'}
				</button>
			</div>

			<div className="flex h-full flex-col gap-3">
				{isLoading ? (
					<>
						<article className="rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-5 shadow-sm">
							<div className="h-5 w-24 rounded bg-[#d1d1d1]" />
							<div className="mt-3 h-8 w-44 rounded bg-[#c9c9c9]" />
							<div className="mt-2 h-4 w-28 rounded bg-[#d1d1d1]" />
						</article>

						<div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_230px] md:items-stretch">
							<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-6 shadow-sm" />

							<div className="grid gap-3 md:grid-rows-2">
								<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-4 shadow-sm" />
								<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-4 shadow-sm" />
							</div>
						</div>
					</>
				) : (
					<>
						{showEmptyDefault ? (
							<article className="rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-4 shadow-sm">
								<div className="h-8 w-44 rounded bg-[#c9c9c9]" />
								<div className="mt-2 h-4 w-28 rounded bg-[#d1d1d1]" />
							</article>
						) : (
							<article className={`rounded-xl p-4 shadow-sm ${activeTone.banner}`}>
								<p className="text-[1.5rem] font-semibold leading-tight">{predictionLabel}</p>
								<p className="text-sm text-white/80">Prediction Result</p>
							</article>
						)}

						<div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_230px] md:items-stretch">
							{showEmptyDefault ? (
								<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#e0e0e0] p-6 shadow-sm" />
							) : (
								<article className={`h-full rounded-xl border-4 bg-[#f3f3f3] p-5 text-center ${activeTone.outline} flex flex-col items-center justify-center`}>
									<div className={`mx-auto grid h-16 w-16 place-content-center rounded-full border-2 text-3xl ${activeTone.iconColor}`}>
										{activeTone.icon}
									</div>
									<p className={`mx-auto mt-4 max-w-70 text-xl font-semibold leading-normal ${activeTone.textColor}`}>
										{activeTone.message}
									</p>
								</article>
							)}

							<div className="grid gap-3 md:grid-rows-2">
								<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-4 shadow-sm">
									<p className="text-center text-4xl">📋</p>
									<p className="mt-2 text-center text-sm italic leading-snug text-slate-600">Environmental conditions favor bacterial survival and spread</p>
									<ul className="mt-3 space-y-1 text-sm text-slate-700">
										<li><span className="font-semibold">Temperature:</span> {formData.Avg_Temp_Weekly}°C</li>
										<li><span className="font-semibold">Humidity:</span> {formData.Humidity_Pct}%</li>
										<li><span className="font-semibold">Rainfall:</span> Increasing</li>
										<li><span className="font-semibold">Sanitation:</span> {formData.Sanitation_Index || 'N/A'}</li>
									</ul>
								</article>

								<article className="h-full rounded-xl border border-[#bfbfbf] bg-[#f3f3f3] p-4 text-center shadow-sm">
									<p className="text-base leading-snug text-slate-600">Resistance Rate for Selected Antibiotic</p>
									<div className="relative mx-auto mt-2 h-24 w-40">
										<svg viewBox="0 0 120 70" className="h-full w-full">
											<path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#dcd4e8" strokeWidth="16" />
											<path
												d="M 10 60 A 50 50 0 0 1 110 60"
												fill="none"
												stroke="#c39fdd"
												strokeWidth="16"
												strokeDasharray="39.25 157"
											/>
										</svg>
										<p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl font-semibold">25%</p>
									</div>
								</article>
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	)
}

export default Simulation
