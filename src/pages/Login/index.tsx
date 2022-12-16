import { Formik } from 'formik'
import { FormikProps } from 'formik/dist/types'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import images from '../../assets/images'

interface IFormLogin {
	formikProps: FormikProps<ILogin>
}

const FormLogin = ({
	formikProps: { values, handleChange, handleSubmit, setErrors }
}: IFormLogin) => {
	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Control
					type="email"
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
			<Form.Group className="mb-3 d-grid pt-2">
				<Button type="submit" className="fw-bold">
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

const Login = () => {
	const initValues = {
		email: '',
		password: ''
	}

	const onSubmit = (values: ILogin) => {
		console.log(values)
	}

	return (
		<Container className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
			<Card style={{ width: 500 }} className="rounded-5 mw-100">
				<Card.Body>
					<Card.Img className="p-5" variant="top" src={images.BANNER_LOGIN} />
					<Formik initialValues={initValues} onSubmit={onSubmit}>
						{(formikProps) => <FormLogin formikProps={formikProps} />}
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
