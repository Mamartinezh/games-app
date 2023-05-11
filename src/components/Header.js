
import Logo from "./Logo"
import './Header.css'
import { useEffect, useRef, useState } from 'react'

export default function Header({ searchCallback }) {

	const searchInput = useRef()
	const [ isFixed, setIsFixed ] = useState(false)
	const [ searchValue, setSearchValue ] = useState('')

	useEffect(() => {

		function listenScroll(e) {
			if (window.scrollY > 80) setIsFixed(true)
			if (window.scrollY === 0) setIsFixed(false)
		}

		function listen4SearchFocus(e) {
			if (e.shiftKey && e.key === "Enter") searchInput.current.focus()
		}

		addEventListener('keypress', listen4SearchFocus)
		addEventListener('scroll', listenScroll)


		return(()=>{
			removeEventListener('keypress', listen4SearchFocus)
			removeEventListener('scroll', listenScroll)
		})

	}, [])

	function handleInputChange(e) {
		if (e.target.value === '') searchCallback('')
		setSearchValue(e.target.value)
	}

	return (

		<div className={`header ${isFixed ? 'fixed' : ''}`}>
			<div className="header-logo--div"><Logo /></div>
			<div className="header-search--div">
				<input 
					ref={searchInput} 
					className="header-search" 
					onChange={handleInputChange} 
					onKeyPress={e => e.key === 'Enter' ? searchCallback(searchValue) : null}
					value={searchValue} 
					placeholder="Search 486,528 games" />
				<i className="fa-solid fa-magnifying-glass"></i>
			</div>
			<div className="header-user--div">
				<p className="header-user--div_img">M</p>
				<i className="fa-solid fa-bell"></i>
				<i className="fa-solid fa-ellipsis"></i>
			</div>
		</div>
	)

}