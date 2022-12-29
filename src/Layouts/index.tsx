import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import IStore from '../data/IStore'
import Loader from '../pages/Loader'

export interface IChildProps {
	children?: React.ReactNode
}

const LayoutDefault = () => {
	const navigate = useNavigate()
	const token = sessionStorage.getItem('token')
	useEffect(() => {
		// if (!token) navigate('/login')
	}, [token, navigate])
	const loading = useSelector((state: IStore) => state.loading)
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<Row className="min-vh-100 d-flex mx-0">
					<Col xs="auto" className="px-0">
						<Navbar />
					</Col>
					<Col className="flex-grow-1 bg-light">
						<Outlet />
					</Col>
				</Row>
			)}
		</>
	)
}

export default LayoutDefault
