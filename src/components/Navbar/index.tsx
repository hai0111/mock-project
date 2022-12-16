import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import images from '../../assets/images'
import { RiHome5Fill, RiHome5Line } from 'react-icons/ri'
import { IoIosCreate } from 'react-icons/io'
import { IoCreateOutline } from 'react-icons/io5'

const Navbar = () => {
	return (
		<Card
			className="vh-100 position-sticky d-flex flex-column top-0 bottom-0 rounded-0 border-bottom-0 border-top-0"
			style={{
				left: 0,
				width: 400
			}}
		>
			<Card.Img variant="top" src={images.BANNER_LOGIN} className="px-5 pt-3" />
			<Card.Body className="flex-grow-1 d-flex flex-column pt-5 px-0">
				<Link
					to={'/'}
					className="fw-semibold text-dark text-decoration-none d-flex align-items-center h5 ps-5 py-3"
				>
					<RiHome5Line className="me-3" size={'2.3rem'} />
					Home
				</Link>
				<Link
					to={'/editor'}
					className="fw-semibold text-dark text-decoration-none d-flex align-items-center h5 ps-5 py-3"
				>
					<IoCreateOutline className="me-3" size={'2.3rem'} />
					New Article
				</Link>
			</Card.Body>
			<Card.Footer></Card.Footer>
		</Card>
	)
}

export default Navbar
