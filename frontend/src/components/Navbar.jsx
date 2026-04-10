import logo from '../assets/logo.png'

function Navbar({ activeView, onChangeView }) {
	return (
		<>
			<header className="bg-[#f5dcb5] px-6 py-4 shadow-sm md:px-14">
				<div className="mx-auto flex max-w-295 items-center justify-between">
					<div className="flex items-center gap-3">
						<img src={logo} alt="ResistDZ logo" className="h-12 w-12 object-contain" />
						<div>
							<h1 className="text-2xl font-semibold leading-none">ResistDZ</h1>
							<p className="mt-1 text-sm text-slate-600">Predict, Prevent, Protect</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-lg font-semibold">User</p>
						<p className="text-sm text-slate-700">RS Kaggle Ducklings</p>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-295 px-6 pt-8 md:px-14">
				<div className="mx-auto mb-7 flex w-fit rounded-full bg-[#f1e0c8] p-1">
					<button
						className={`rounded-full px-7 py-2 text-base font-medium transition ${activeView === 'dashboard' ? 'bg-[#f5c376] text-slate-900 shadow-sm' : 'text-slate-700 hover:bg-[#f8e8cf]'}`}
						onClick={() => onChangeView('dashboard')}
					>
						Dashboard
					</button>
					<button
						className={`rounded-full px-7 py-2 text-base font-medium transition ${activeView === 'simulation' ? 'bg-[#f5c376] text-slate-900 shadow-sm' : 'text-slate-700 hover:bg-[#f8e8cf]'}`}
						onClick={() => onChangeView('simulation')}
					>
						Simulation
					</button>
				</div>
			</div>
		</>
	)
}

export default Navbar
