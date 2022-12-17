import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import { AiFillSetting } from 'react-icons/ai'
import { IoIosCreate } from 'react-icons/io'
import { IoCreateOutline } from 'react-icons/io5'
import { RiHome5Fill, RiHome5Line, RiLogoutBoxLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import myAxios from '../../api/myAxios'
import images from '../../assets/images'
import { User } from '../../data'
import IStore from '../../data/IStore'
import Loader from '../../pages/Loader'
import Popup from '../Popup'

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
	const [popup, setPopup] = useState<boolean>(false)
	const { pathname } = useLocation()
	const { user } = useSelector((state: IStore) => state)
	const { setUser } = User.actions

	const dispatch = useDispatch()

	const togglePopup = () => {
		setPopup(!popup)
	}

	const navigate = useNavigate()

	const logout = () => {
		navigate('/login')
		toast('Logout successful', {
			className: 'bg-danger text-light',
			position: 'top-right',
			hideProgressBar: false
		})
	}

	const getDataUser = useCallback(async () => {
		try {
			const { data } = await myAxios.get('user')
			dispatch(setUser(data.user))
		} catch (err) {
			navigate('/login')
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
						<div className="position-relative">
							<Link
								to={`/profiles/${user.username}`}
								className="text-dark text-decoration-none d-flex ps-4 py-3 my-5"
							>
								<Image
									src={user.image}
									width={80}
									height={80}
									style={{ objectFit: 'cover' }}
									className="rounded-circle"
								/>
								<div className="py-2 px-3">
									<div className="fw-bold h5">{user.username}</div>
									<div>{user.email}</div>
								</div>
							</Link>
							<div
								style={{
									right: 16
								}}
								className="position-absolute top-50 translate-middle-y"
							>
								<Link
									to={'/settings'}
									style={{ height: 50, width: 50 }}
									className="border animation-2s text-secondary spinner-border d-inline-flex rounded-circle hover"
								>
									<AiFillSetting size={'2rem'} className="m-auto" />
								</Link>
							</div>
						</div>
						{NAVBAR_ITEMS.map((item) => {
							const check = pathname === item.path
							const Icon = check ? item.activeIcon : item.icon
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
				</Card>
			) : (
				<Loader />
			)}
		</>
	)
}

export default Navbar
