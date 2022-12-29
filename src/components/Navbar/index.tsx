import { useCallback, useEffect, useState } from 'react'
import { Card, Image } from 'react-bootstrap'
import { AiFillSetting } from 'react-icons/ai'
import { IoIosCreate } from 'react-icons/io'
import { CgLogIn } from 'react-icons/cg'
import { IoCreateOutline } from 'react-icons/io5'
import { RiHome5Fill, RiHome5Line, RiLogoutBoxLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import images from '../../assets/images'
import { User } from '../../data'
import IStore from '../../data/IStore'
import { toastSuccess } from '../../hooks/toast'
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
	const [loading, setLoading] = useState<boolean>(false)
	const { setUser } = User.actions

	const dispatch = useDispatch()

	const togglePopup = () => {
		setPopup(!popup)
	}

	const navigate = useNavigate()

	const logout = () => {
		navigate('/login')
		toastSuccess('Logout successfully')
	}

	const getDataUser = useCallback(async () => {
		setLoading(true)
		try {
			const { data } = await myAxios.get('user')
			dispatch(setUser(data.user))
		} catch (err) {
			dispatch(setUser(null))
		}
		setLoading(false)
		// eslint-disable-next-line
	}, [setUser, dispatch])

	useEffect(() => {
		const token = sessionStorage.getItem('token')
		if (token && !user) {
			getDataUser()
		}
	}, [getDataUser, user])
	return (
		<>
			{!loading ? (
				<Card className="h-100 w-100 start-0 position-sticky d-flex flex-column top-0 bottom-0 rounded-0 border-bottom-0 border-top-0">
					<Card.Img
						variant="top"
						src={images.BANNER_LOGIN}
						style={{
							width: '400px'
						}}
						className="px-5 pt-5"
					/>
					<Card.Body className="flex-grow-1 d-flex flex-column px-0">
						<div className="position-relative mt-5">
							{user ? (
								<>
									<Link
										to={`/profiles/${user.username}`}
										className="text-dark text-decoration-none d-flex ps-4 py-2"
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
											<div className="fz-15">{user.email}</div>
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
								</>
							) : (
								<Link
									to={`/login`}
									className="text-dark text-decoration-none d-flex align-items-center ps-4 py-2"
								>
									<Image
										src={images.DEFAULT_USER}
										width={80}
										height={80}
										style={{ objectFit: 'cover' }}
										className="rounded-circle"
									/>
									<div className="py-2 px-3 h4 ms-2">Login</div>
								</Link>
							)}
						</div>
						<div className="mt-3">
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
						</div>
						{user && (
							<div
								onClick={togglePopup}
								className="fw-semibold  text-danger pointer text-decoration-none d-flex align-items-center h5 ps-5 py-3"
							>
								<RiLogoutBoxLine className="me-3" size={'2.3rem'} />
								Logout
								<Popup
									color="danger"
									content="Are you sure you want to sign out?"
									title="Confirm logout"
									toggle={togglePopup}
									success={logout}
									show={popup}
								/>
							</div>
						)}
					</Card.Body>
				</Card>
			) : (
				<Loader />
			)}
		</>
	)
}

export default Navbar
