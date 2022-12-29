import { ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'

export interface ITab {
	text: string
	value: string | number
	icon: ReactNode
}

interface IProps {
	tab: number | string
	tabs: ITab[]
	setTab(item: ITab): void
}

const Tabs = (props: IProps) => {
	return (
		<Row className="justify-content-center">
			<Col xs="auto" className="px-0">
				{props.tabs.map((item) => (
					<div
						key={item.value}
						onClick={() => {
							props.setTab(item)
						}}
						className="text-decoration-none text-secondary py-2 px-3 d-inline-flex align-items-center pointer"
						style={{
							borderTopColor: props.tab === item.value ? '#000' : 'transparent',
							borderTopWidth: 2,
							borderTopStyle: 'solid'
						}}
					>
						<span className="me-1 d-inline-block" style={{ marginBottom: 3 }}>
							{item.icon}
						</span>
						{item.text}
					</div>
				))}
			</Col>
		</Row>
	)
}

export default Tabs
