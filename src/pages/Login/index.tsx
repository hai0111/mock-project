import { Formik } from 'formik'
import { FormikProps } from 'formik/dist/types'
import { useEffect, useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import myAxios from '../../api/myAxios'
import images from '../../assets/images'
import { IResponseSuccess } from '../Register'

interface IFormLogin extends FormikProps<ILogin> {
	loading: boolean
	errors: any
	response: IResponse | null
}

const FormLogin = ({
	values,
	handleChange,
	handleSubmit,
	loading,
	response
}: IFormLogin) => {
	const [isValid, setIsValid] = useState<string>('')
	const navigate = useNavigate()
	useEffect(() => {
		if (response?.status === 403) {
			setIsValid(response.data?.['email or password'][0])
		} else if (response?.status === 200) {
			toast('Logged in successfully', {
				hideProgressBar: true,
				position: 'top-right',
				className: 'bg-success text-white'
			})
			sessionStorage.setItem('token', response.data.token)
			navigate('/')
		}
	}, [response, navigate])

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Control
					type="text"
					name="email"
					value={values.email}
					onChange={handleChange}
					placeholder="Email..."
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					type="password"
					name="password"
					value={values.password}
					onChange={handleChange}
					placeholder="Password..."
				/>
			</Form.Group>
			<Form.Group>
				<div className="text-center text-danger">{isValid}</div>
			</Form.Group>
			<Form.Group className="mb-3 d-grid pt-2">
				<Button disabled={loading} type="submit" className="fw-bold">
					Login
				</Button>
			</Form.Group>
		</Form>
	)
}

interface ILogin {
	email: string
	password: string
}

interface IResponseError {
	'email or password': string[]
}

interface IResponse {
	status: number
	data: IResponseError & IResponseSuccess
}

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [response, setResponse] = useState<IResponse | null>(null)
	const initValues = {
		email: '',
		password: ''
	}

	const onSubmit = async (values: ILogin) => {
		setLoading(true)
		try {
			const { status, data } = await myAxios.post(
				'/users/login',
				JSON.stringify({ user: values })
			)
			setResponse({ status, data: data.user })
		} catch (err: any) {
			const {
				response: { status, data }
			} = err
			setResponse({ status, data: data.errors })
		}
		setLoading(false)
	}

	useEffect(() => {
		sessionStorage.clear()
		document.title = 'Login'
	}, [])

	return (
		<Container className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<Card style={{ width: 500 }} className="rounded-5 mw-100">
				<Card.Body>
					<Card.Img className="p-5" variant="top" src={images.BANNER_LOGIN} />
					<Formik initialValues={initValues} onSubmit={onSubmit}>
						{(formikProps) => (
							<FormLogin
								loading={loading}
								response={response}
								{...formikProps}
							/>
						)}
					</Formik>
				</Card.Body>
			</Card>
			<Card style={{ width: 500 }} className="mt-3 mw-100">
				<Card.Body className="px-5 text-center">
					Already have an account? <Link to={'/register'}>Register now</Link>
				</Card.Body>
			</Card>
		</Container>
	)
}

export default Login
