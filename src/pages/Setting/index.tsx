import { Formik, FormikProps } from 'formik'
import {
	Button,
	Col,
	Container,
	Form,
	FormGroup,
	Image,
	Row
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import IStore from '../../data/IStore'
import { IResponseSuccess } from '../Register'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import myAxios from '../../api/myAxios'
import LoadingEffect from '../../components/LoaderEffect'
import { User } from '../../data'

interface IProps extends FormikProps<IResponseSuccess> {
	errors: any
	image: string
}

const SettingForm = ({
	values,
	handleBlur,
	handleChange,
	handleReset,
	handleSubmit,
	errors,
	image,
	touched
}: IProps) => {
	const [imgSrc, setImgSrc] = useState<string>(image)
	const [errorImg, setErrorImg] = useState<string | null>(null)

	useEffect(() => {
		const img = document.createElement('img')
		img.src = values.image
		img.onload = () => {
			setErrorImg(null)
			setImgSrc(values.image)
		}
		img.onerror = () => {
			setErrorImg('URL is invalid')
			setImgSrc(image)
		}
		return () => {
			img.remove()
		}
	}, [values.image, image])

	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!errorImg) {
			handleSubmit(e)
		}
	}

	return (
		<Form onSubmit={submit}>
			<Form.Group className="d-flex justify-content-center mb-5">
				<Image
					src={imgSrc}
					width={180}
					height={180}
					className="rounded-circle"
				/>
			</Form.Group>
			<Form.Group className="mt-3">
				<Form.Label className="fw-semibold text-black h5">
					Image URL <span className="text-danger">*</span>
				</Form.Label>
				<Form.Control
					as="textarea"
					size="lg"
					rows={5}
					style={{ resize: 'none' }}
					name="image"
					value={values.image}
					onChange={handleChange}
					onBlur={handleBlur}
					isInvalid={(touched.image && errors.image) || errorImg}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.image || errorImg}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mt-3">
				<Form.Label className="fw-semibold text-black h5">
					Username <span className="text-danger">*</span>
				</Form.Label>
				<Form.Control
					size="lg"
					name="username"
					value={values.username}
					onChange={handleChange}
					onBlur={handleBlur}
					isInvalid={touched.username && errors.username}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.username}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mt-3">
				<Form.Label className="fw-semibold text-black h5">
					Email <span className="text-danger">*</span>
				</Form.Label>
				<Form.Control
					size="lg"
					name="email"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					isInvalid={touched.email && errors.email}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.email}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mt-3">
				<Form.Label className="fw-semibold text-black h5">
					Password <span className="text-danger">*</span>
				</Form.Label>
				<Form.Control
					size="lg"
					type="password"
					name="password"
					value={values.password}
					onChange={handleChange}
					onBlur={handleBlur}
					isInvalid={touched.password && errors.password}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.password}
				</Form.Control.Feedback>
			</Form.Group>
			<FormGroup className="mt-4 d-flex justify-content-end">
				<Button
					size="lg"
					type="button"
					variant="danger"
					className="ms-3"
					onClick={() => {
						window.history.back()
					}}
				>
					Cancel
				</Button>
				<Button
					size="lg"
					type="button"
					variant="secondary"
					className="ms-3"
					onClick={handleReset}
				>
					Reset
				</Button>
				<Button size="lg" type="submit" variant="success" className="ms-3">
					Submit
				</Button>
			</FormGroup>
		</Form>
	)
}

const Setting = () => {
	const user = useSelector((store: IStore) => store.user)
	const [loading, setLoading] = useState<boolean>(false)
	const dispatch = useDispatch()
	const setUser = User.actions.setUser
	const submit = async (values: IResponseSuccess) => {
		setLoading(true)
		try {
			const { status, data } = await myAxios.put(
				'/user',
				JSON.stringify({
					user: values
				})
			)
			if (status === 200) {
				dispatch(setUser(data.user))
			}
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}
	const validation = Yup.object().shape({
		image: Yup.string().required('Please enter image url'),
		bio: Yup.string(),
		username: Yup.string().required('Please enter username'),
		email: Yup.string()
			.required('Please enter email')
			.email('Email is invalid'),
		password: Yup.string().min(6, 'Password contains at least 6 characters')
	})
	return (
		<Container className="pt-5">
			<Row className="justify-content-center">
				{!loading ? (
					<Col sm={12} md={8}>
						{user && (
							<Formik
								initialValues={user}
								onSubmit={submit}
								validationSchema={validation}
							>
								{(props) => <SettingForm image={user.image} {...props} />}
							</Formik>
						)}
					</Col>
				) : (
					<Col className="vh-100">
						<LoadingEffect />
					</Col>
				)}
			</Row>
		</Container>
	)
}

export default Setting
