import { Formik } from 'formik'
import { FormikProps } from 'formik/dist/types'
import { useEffect, useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import myAxios from '../../api/myAxios'
import images from '../../assets/images'

interface IResponseErrors {
	email?: string[]
	username?: string[]
}

interface IResponseSuccess extends IRegister {
	bio: null
	token: string
}

interface IResponse {
	status: number
	res: IResponseErrors & IResponseSuccess
}

interface IFormikRegister extends FormikProps<IRegister> {
	errors: any
	loading: boolean
	response: IResponse | null
}

const FormRegister = ({
	values,
	handleChange,
	handleSubmit,
	errors,
	touched,
	handleBlur,
	loading,
	response,
	setFieldError
}: IFormikRegister) => {
	const navigate = useNavigate()
	useEffect(() => {
		if (response?.status === 422) {
			setFieldError('email', response.res.email?.[0])
			setFieldError('username', response.res.username?.[0])
		} else if (response?.status === 200) {
			toast('Sign Up Success ☺', {
				position: 'top-right',
				className: 'bg-success text-white',
				hideProgressBar: true
			})
			sessionStorage.setItem('token', response.res.token)
			navigate('/')
		}
	}, [response, navigate, setFieldError])

	return (
		<Form className="mt-3" onSubmit={handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Control
					type="username"
					name="username"
					value={values.username}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Username..."
					isInvalid={touched.username && errors.username}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.username}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					type="email"
					name="email"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Email..."
					isInvalid={touched.email && errors.email}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.email}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					type="password"
					name="password"
					value={values.password}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Password..."
					isInvalid={touched.password && errors.password}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.password}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mb-3 d-grid pt-2">
				<Button disabled={loading} type="submit" className="fw-bold">
					Register
				</Button>
			</Form.Group>
		</Form>
	)
}

interface IRegister {
	email: string
	password: string
	username: string
}

const Register = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [response, setResponse] = useState<IResponse | null>(null)
	const initValues = {
		email: '',
		password: '',
		username: ''
	}
	const onSubmit = async (values: IRegister) => {
		setLoading(true)
		try {
			const res = await myAxios.post('/users', JSON.stringify({ user: values }))
			const { status, data } = res
			setResponse({ status, res: data.user })
		} catch (err: any) {
			const {
				response: { status, data }
			} = err
			setResponse({ status, res: data.errors })
		}
		setLoading(false)
	}

	const validation = Yup.object().shape({
		username: Yup.string().required('Please enter username'),
		email: Yup.string().required('Please enter email').email('Email invalid'),
		password: Yup.string()
			.required('Please enter password')
			.min(6, 'Password contains at least 6 characters')
	})

	return (
		<Container className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<Card style={{ width: 500 }} className="rounded-5">
				<Card.Body>
					<Card.Img className="p-5" variant="top" src={images.BANNER_LOGIN} />
					<Formik
						initialValues={initValues}
						onSubmit={onSubmit}
						validationSchema={validation}
					>
						{(formikProps) => (
							<FormRegister
								response={response}
								loading={loading}
								{...formikProps}
							/>
						)}
					</Formik>
				</Card.Body>
			</Card>
			<Card style={{ width: 500 }} className="mt-3">
				<Card.Body className="px-5 text-center">
					Do you have an account? <Link to={'/login'}>Login now</Link>
				</Card.Body>
			</Card>
		</Container>
	)
}

export default Register
