import { Modal } from 'react-bootstrap'

export interface IModal {
	show: boolean
	toggle(): void
}

interface IProps extends IModal {}

const Detail = (props: IProps) => {
	return <Modal></Modal>
}

export default Detail
