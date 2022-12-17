import { Button, Modal } from 'react-bootstrap'

interface IProps {
	show: boolean
	ok?: true
	success(): void
	toggle(): void
	title: string
	content: string
	color: string
}

const Popup = ({ color = 'primary', ...props }: IProps) => {
	return (
		<Modal show={props.show} onHide={props.toggle} backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{props.content}</Modal.Body>
			<Modal.Footer>
				{props.ok ? (
					<Button variant={color}>Ok</Button>
				) : (
					<>
						<Button onClick={props.toggle}>Đóng</Button>
						<Button variant={color} onClick={props.success}>
							Đồng ý
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	)
}

export default Popup
