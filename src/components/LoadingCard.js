
import { useEffect, useRef } from 'react'

const svgStyle = {
	position: 'absolute',
	inset: 0,
	margin: 'auto',
	transformOrigin: '50%'
}

export default function LoadingCard({ diameter = 130, height = 100, tick = 5, gap = 40 }) {

	const outer = useRef()

	useEffect(() => {

		let children = outer.current.childNodes
		children.forEach((child, id) => child.animate([
			{
				transform: 'rotate(0deg)'
			},
			{
				transform: `rotate(${id === 1 ? -360 : 360}deg)`
			},			
		], {
			duration: 2500,
			iterations: Infinity,
		}))

	}, [])


	return (
		<>
			<div ref={outer} className="loading" style={{width: '100%', height: `${height}px`, position: 'relative'}}>
				<svg 
					strokeWidth={tick} 
					stroke='#fff'
					strokeDasharray={`${Math.PI*diameter/2}px`}
					strokeDashoffset={`${tick*2}px`}
					style={svgStyle} 
					width={diameter} 
					height={diameter} 
					fill="none">
					<circle 
						ref={outer}
						className="loading-out" 
						cx={diameter/2} 
						cy={diameter/2}
						r={diameter/2 - tick} 
						fill="none"/>
				</svg>
				<svg 
					strokeWidth={tick}
					stroke='#fff'
					strokeDasharray={`${(Math.PI*(diameter-gap))/2}px`}
					strokeDashoffset={`${tick*2}px`}
					style={svgStyle} 
					width={diameter - gap} 
					height={diameter - gap} 
					fill="none" 
					stroke='#fff'>
					<circle 
						className="loading-in" 
						cx={(diameter - gap)/2}
						cy={(diameter - gap)/2} 
						r={(diameter - gap)/2-tick} 
						fill="none" />
				</svg>
			</div>
		</>
	)
}