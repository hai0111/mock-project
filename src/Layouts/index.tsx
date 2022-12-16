import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export interface IChildProps {
	children?: React.ReactNode
}

const LayoutDefault = () => {
	const navigate = useNavigate()
	const token = sessionStorage.getItem('token')
	useEffect(() => {
		if (!token) navigate('/login')
	}, [token, navigate])
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
