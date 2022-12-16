import React from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export interface IChildProps {
	children?: React.ReactNode
}

const LayoutDefault = () => {
	return (
		<div className="min-vh-100 d-flex">
			<div>
				<Navbar />
			</div>
			<div className="flex-grow-1">
				<Container className="ms-3 my-3">
					<Outlet />
				</Container>
			</div>
		</div>
	)
}

export default LayoutDefault
