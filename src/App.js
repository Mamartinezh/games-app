
import Header from './components/Header'
import NavMenu from './components/NavMenu'
import GameCard from './components/GameCard'
import LoadingCard from './components/LoadingCard'
import { useEffect, useState } from 'react'

const rawgKey = '8a48b8a714bd49f9b77fa8e0fd29c6c8'

const date = new Date()
const year = date.getFullYear()
const now = date.toISOString().split('T')[0]
const nextWeek = new Date(new Date().setDate(date.getDate() + 14))
					.toISOString().split('T')[0]
const week = new Date(new Date().setDate(date.getDate() + 7))
					.toISOString().split('T')[0]
const last30 = new Date(new Date().setDate(date.getDate() - 30))
					.toISOString().split('T')[0]

const navOptions = [
	{
		title: 'Reviews',
		content: []
	},
	{	
		title: "New Releases",
		content: [
			{
				name: 'last30', label: 'Last 30 days', icon: <i className="fa-solid fa-star"></i>
			},
			{
				name: 'week', label: 'This week', icon: <i className="fa-solid fa-fire"></i>
			},
			{
				name: 'nextweek', label: 'Next week', icon: <i className="fa-solid fa-forward-fast"></i>
			},
		]	
	},
	{	
		title: "Top",
		content: [
			{
				name: 'best', label: 'Best of the year', icon: <i className="fa-solid fa-trophy"></i>
			},
			{
				name: 'popular', label: `Popular in ${year}`, icon: <i className="fa-solid fa-chart-simple"></i>
			},
			{
				name: 'alltime', label: 'All time top 250', icon: <i className="fa-solid fa-crown"></i>
			},
		]	
	},	
	{	
		title: "All Games",
		content: [
			{
				name: 'allgames', label: 'All Games', icon: <i className="fa-sharp fa-solid fa-globe"></i>
			},
		]	
	},
]

const criterias = navOptions.flatMap(item => item.content, Infinity)
							.reduce((item, next) => ({...item, [next.name]: next.label}), {})

export default function App() {

	const [ navFilters, setNavFilters ] = useState({
		'platforms': {
			label: 'Platforms',
			icon: <i className="fa-solid fa-gamepad"></i>,
			content: []
		},
		'genres': {
			label: 'Genres',
			icon: <i className="fa-solid fa-bomb"></i>,
			content: []
		},
		'developers': {
			label: 'Developers',
			icon: <i className="fa-solid fa-code"></i>,
			content: []
		},
		'creators': {
			label: 'Creators',
			icon: <i className="fa-solid fa-money-bill"></i>,
			content: []
		},
		'tags': {
			label: 'Tags',
			icon: <i className="fa-solid fa-tag"></i>,
			content: []
		}
	})

	const [ queryCount, setQueryCount ] = useState(1)
	const [ page, setPage ] = useState(1)
	const [ searchQuery, setSearchQuery ] = useState('')
	const [ games, setGames ] = useState([])
	const [ isLoading, setIsLoading ] = useState(false)
	const [ searchCriteria, setSearchCriteria ] = useState('allgames')

	useEffect(() => {
		getGamesData()
	}, [page, queryCount])

	Object.keys(navFilters).forEach(key => {
		if (navFilters[key].content.length === 0) getFilterValues(key)
	})

	function getFilterValues(key) {
		fetch(`https://api.rawg.io/api/${key}?key=${rawgKey}`)
			.then(res => res.json())
			.then(data => {setNavFilters(prevState => ({
				...prevState,
				[key]: {
					...prevState[key],
					// content: data.results.map(item => ({...item, active: false}))
					content: data.results
				}
			}))
		})
	}

	function parseFilterDic() {
		return Object.keys(navFilters).reduce((filt, nxt) => ({
			...filt, 
			[nxt]: navFilters[nxt].content.map(item => item.active ? item.id : null).filter(item => item) 
		}), {})		
	}

	async function getGamesData() {
		setIsLoading(true)
		let filters = parseFilterDic()
		let filtersStr = Object.keys(filters).reduce((str, nxt) => 
			str.concat(filters[nxt].length > 0 ? `&${nxt}=${filters[nxt].join(',')}` : ''), '')
		let res = await fetch(`https://api.rawg.io/api/games?key=${rawgKey}&page_size=24&page=${page}
			${searchCriteria === 'popular' ? `&dates=${year}-01-01,${year}-12-31` : ''}
			${searchCriteria === 'popular' ? `&ordering=-metacritic` : ''}
			${searchCriteria === 'best' ? `&dates=${year}-01-01,${year}-12-31` : ''}
			${searchCriteria === 'best' ? `&ordering=-rating` : ''}
			${searchCriteria === 'alltime' ? `&ordering=-rating` : ''}
			${searchCriteria === 'nextweek' ? `&dates=${week},${nextWeek}` : ''}
			${searchCriteria === 'week' ? `&dates=${now},${week}` : ''}
			${searchCriteria === 'last30' ? `&dates=${last30},${now}` : ''}
			${searchQuery !== '' ? `&search=${searchQuery}` : ''}
			${filtersStr}`)
		if (res.status !== 200) {
			setIsLoading(false)
			return
		}
		let data = await res.json()
		console.log(data)
		setIsLoading(false)
		setGames(prevState => [
			...prevState,
			...data.results.map(item => ({
				id: item.id,
				name: item.name, 
				img: item.background_image,
				votes: item.ratings_count,
				rating: item.rating
			}))]
		)
	}

	function changeSearchCriteria(newCriteria) {
		if (newCriteria === searchCriteria) return
		setGames([])
		setPage(1)
		setQueryCount(queryCount + 1)
		setSearchCriteria(newCriteria)	
	}

	function addSearchFilter(filter, id) {
		setGames([])
		setPage(1)
		setQueryCount(queryCount + 1)
		setNavFilters(prevState => ({
				...prevState,
				[filter]: {
					...prevState[filter],
					content: prevState[filter].content.map((item, idx) => 
						idx === id ? {...item, active: !item.active} : item)
				}
			}))
	}

	function searchByValue(value) {
		if (searchQuery === '' && value === '') return
		setGames([])
		setPage(1)	
		setQueryCount(queryCount + 1)
		setSearchQuery(value)
	}

	return (
		<div className="app">
			<Header searchCallback={searchByValue}/>
			<div className="app-main">
				<NavMenu 
					options={navOptions} 
					filters={navFilters} 
					current={searchCriteria} 
					filtersCallback={addSearchFilter}
					optionsCallback={changeSearchCriteria}/>
				<div className="app-main--games">
					<h1 className="app-main--games_title">{criterias[searchCriteria]}</h1>
					<div className="app-main--games_grid">
						{games.map((game, id) => <GameCard key={id} {...game} />)}
					</div>
					{isLoading && <LoadingCard diameter={60} tick={2} gap={30} />}
					{!isLoading && 
						<div 
							className="app-main--loadmore" 
							onClick={e => setPage(prevPage => prevPage + 1)}>
							<i className="fa-solid fa-plus"></i>
						</div>}
{/*					<div className="ham" onClick={e => e.currentTarget.classList.toggle("active")}>
						<div></div>
					</div>*/}
				</div>
			</div>
		</div>
	)
}