
import { useState } from 'react'

export default function NavMenu({ options, filters, filtersCallback, optionsCallback, current }) {

	const [ deployedFilter, setDeployedFilter ] = useState('')

	function deployFilter(filter) {
		setDeployedFilter(deployedFilter === filter ? '' : filter)
	}

	return (

		<div className="nav">
			{options.map((section, id) => 
				<div key={id} className="nav-div">
					<h2 className="nav-titles">{section.title}</h2>
					{section.content.map((option, idx) => 
						<p className={`nav-div--option ${current === option.name ? 'active' : ''}`}
							key={idx} 
							title={option.label}
							onClick={e=>optionsCallback(option.name)}>
						{option.icon}<span>{option.label}</span>
						</p>
					)}
				</div>
			)}
			<div className="nav-div">
				<h2 className="nav-titles">Filters</h2>
				{Object.keys(filters).map((filter, id) => 
					<div key={id} className={`nav-div--filter ${deployedFilter === filter ? 'active' : ''}`}>
						<p title={filters[filter].label} onClick={e => deployFilter(filter)}>
							{filters[filter].icon}<span>{filters[filter].label}</span>
							{deployedFilter === filter && <i className="fa-solid fa-chevron-up"></i>}
							{deployedFilter !== filter && <i className="fa-solid fa-chevron-down"></i>}
						</p>
						<div 
							className="nav-div--filter_options" 
							style={{display: `${deployedFilter === filter ? 'block' : 'none'}`}}>
							{filters[filter].content.map((opt, idx)=>
								<div key={idx} title={opt.name} onClick={e => filtersCallback(filter, idx)}>
									<i className={`fa-solid fa-square-check ${opt.active ? 'active-filter' : ''}`}></i>
									&ensp;{opt.name}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>

	)

}

