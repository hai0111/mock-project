import { useCallback, useEffect } from 'react'
import { Card, Image } from 'react-bootstrap'
import { IoIosCreate } from 'react-icons/io'
import { IoCreateOutline } from 'react-icons/io5'
import { RiHome5Fill, RiHome5Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import images from '../../assets/images'
import { IStore, User } from '../../data'
import { AiFillSetting } from 'react-icons/ai'
import Loading from '../../pages/Loading'

const NAVBAR_ITEMS = [
	{
		path: '/',
		icon: RiHome5Line,
		activeIcon: RiHome5Fill,
		text: 'Home'
	},
	{
		path: '/editor',
		icon: IoCreateOutline,
		activeIcon: IoIosCreate,
		text: 'New Article'
	}
]

const Navbar = () => {
	const { pathname } = useLocation()
	const user = useSelector((state: IStore) => state.user)
	const { setUser } = User.actions

	const dispatch = useDispatch()

	const getDataUser = useCallback(async () => {
		try {
			const { data } = await myAxios.get('user')
			dispatch(setUser(data.user))
		} catch (err) {
			console.log(err)
		}
	}, [setUser, dispatch])

	useEffect(() => {
		const token = sessionStorage.getItem('token')
		if (token && !user) {
			getDataUser()
		}
	}, [getDataUser, user])
	return (
		<>
			{user ? (
				<Card
					className="vh-100 position-sticky d-flex flex-column top-0 bottom-0 rounded-0 border-bottom-0 border-top-0"
					style={{
						left: 0,
						width: 450
					}}
				>
					<Card.Img
						variant="top"
						src={images.BANNER_LOGIN}
						style={{
							width: '60%'
						}}
						className="px-5 pt-5"
					/>
					<Card.Body className="flex-grow-1 d-flex flex-column px-0">
						<Link
							to={'/profile'}
							className="text-dark text-decoration-none d-flex ps-4 py-3 my-5"
						>
							<Image src={user.image} width={80} className="rounded-circle" />
							<div className="py-2 px-3">
								<div className="fw-bold h5">{user.username}</div>
								<div>{user.email}</div>
							</div>
							<div className="align-self-center p-3">
								<Link
									to={'/settings'}
									style={{ width: 50, height: 50 }}
									className="border animation-2s text-secondary spinner-border d-inline-flex justify-content-center align-items-center rounded-circle hover"
								>
									<AiFillSetting size={'2rem'} />
								</Link>
							</div>
						</Link>
						{NAVBAR_ITEMS.map((item) => {
							const Icon = pathname === item.path ? item.activeIcon : item.icon
							return (
								<Link
									to={item.path}
									key={item.path}
									className="fw-semibold text-dark text-decoration-none d-flex align-items-center h5 ps-5 py-3"
								>
									<Icon className="me-3" size={'2.3rem'} />
									{item.text}
								</Link>
							)
						})}
					</Card.Body>
					<Card.Footer></Card.Footer>
				</Card>
			) : (
				<Loading />
			)}
		</>
	)
}

export default Navbar
