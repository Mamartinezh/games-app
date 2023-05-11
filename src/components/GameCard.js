
import { useRef, useState } from 'react'
const fetch = require("node-fetch");

export default function GameCard(props) {

	const card = useRef()
	const timeout = useRef()
	const [ videoUrl, setVideoUrl ] = useState(null)
	const [ isExpanded, setIsExpanded ] = useState(false)

	function countForVideo(e, id) {
		timeout.current = setTimeout(getYTVideo, 1500)
		card.current.addEventListener('mouseleave', clearCountListener)
	}

	function clearCountListener() {
		clearTimeout(timeout.current)
		card.current.removeEventListener('mouseleave', clearCountListener)
	}

	async function getYTVideo() {
		if (videoUrl !== null) return
		const yurl = `https://www.googleapis.com/youtube/v3/search?key=
					${'AIzaSyCSO4BevI0k6tedHCNFX0Gj50eWt2gwiz8'}&type=video&part=snippet&q=${props.name} trailer`;
		const response = await fetch(yurl);
		const data = await response.json();		
		setVideoUrl(data.items[0].id.videoId)
	}

	async function expandCard(e) {
		return
		let grid = card.current.parentElement
		clearCountListener()
		await getYTVideo()
		setIsExpanded(true)
		addEventListener('click', listenClickOutside, true)
	}

	function listenClickOutside(e) {
		if (card.current.contains(e.target)) return
		e.stopPropagation()
		setIsExpanded(false)
		setVideoUrl(null)
		removeEventListener('click', listenClickOutside, true)
	}

	console.log(isExpanded)

	return (

		<div 
			ref={card} 
			style={isExpanded ? {
				// position: 'relative',
				// left: `${(card.current.parentElement.clientWidth - card.current.clientWidth) / 2 - card.current.offsetLeft}px`,
				// top: `${window.scrollY - card.current.offsetTop + card.current.clientHeight / 2}px`,
				// transform: 'scale(1.2)',
				// zIndex: 2
			} : {}}
			className={`gamecard ${isExpanded && 'expanded'}`} 
			onMouseEnter={!isExpanded ? e => countForVideo(e, props.id) : null} 
			onMouseLeave={!isExpanded ? e => setVideoUrl(null) : null}>
			{!videoUrl && <img className="gamecard-img" src={props.img}/>}
			{videoUrl && 
				<iframe 
					onError={e=>console.log(e)}
					className='gamecard-video'
					width="100%" 
					height="120px" 
					src={`https://www.youtube.com/embed/${videoUrl}`}
					title="YouTube video player" 
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
			{!videoUrl && <i className="fa-solid fa-play gamecard-play" onClick={getYTVideo}></i>}
			<div className="gamecard-data" onClick={expandCard}>
				<div className="gamecard-data--platforms">
					<i className="fa-brands fa-playstation"></i>
					<i className="fa-brands fa-xbox"></i>
					<i className="fa-brands fa-windows"></i>
				</div>
				<h3 className="gamecard-data--title">{props.name}</h3>
				<p className="gamecard-data--votes"><i className="fa-solid fa-plus"></i>&ensp;{props.votes}</p>
				<span className="gamecard-data--rating">{props.rating}</span>
			</div>
		</div>

	)

}
