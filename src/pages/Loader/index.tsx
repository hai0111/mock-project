import { Container, Image } from 'react-bootstrap'
import images from '../../assets/images'

const Loader = () => {
	return (
		<Container
			fluid
			style={{
				inset: 0,
				zIndex: 999
			}}
			className="d-flex flex-column align-items-center justify-content-around position-fixed bg-white"
		>
			<div></div>
			<Image src={images.ICON_LOADING} />
			<Image src={images.ICON_LOADING2} />
		</Container>
	)
}

export default Loader
