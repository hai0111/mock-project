import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import {
	Badge,
	Button,
	Col,
	Container,
	FormControl,
	Image,
	Row
} from 'react-bootstrap'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import { toastError } from '../../hooks/toast'
import { formatTime } from '../../hooks/useDateTime'
import Loader from '../Loader'
import { ButtonFollowing, IPost, IProfile } from '../Profile'

interface IComment {
	id: number
	createdAt: string //'2021-11-24T12:11:08.340Z'
	updatedAt: string //'2021-11-24T12:11:08.340Z'
	body: string
	author: IProfile
}

const ArticleDetail = () => {
	const { name } = useParams()
	const [data, setData] = useState<IPost | null>(null)
	const [cmts, setCmts] = useState<IComment[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [cmtInput, setCmtInput] = useState<string>('')

	const handleFollow = async () => {
		const method = data?.author.following ? 'delete' : 'post'
		try {
			const res: AxiosResponse<{ profile: IProfile }> = await myAxios[method](
				`profiles/${data?.author.username}/follow`
			)
			if (res.status === 200 && data) {
				setData({ ...data, author: res.data.profile })
			}
		} catch (error) {
			toastError('An error occurred')
		}
	}

	const getData = async () => {
		try {
			const { status, data: res }: AxiosResponse<{ article: IPost }> =
				await myAxios.get(`articles/${name}`)
			if (status === 200) {
				setData(res.article)
				document.title = res.article.title
			}
		} catch (err) {}
		setLoading(false)
	}

	const getComment = async () => {
		try {
			const { status, data: res }: AxiosResponse<{ comments: IComment[] }> =
				await myAxios.get(`articles/${name}/comments`)
			if (status === 200) {
				setCmts(res.comments)
			}
		} catch (err) {}
		setLoading(false)
	}

	const onFavorite = async (item: IPost) => {
		const method = item.favorited ? 'delete' : 'post'
		try {
			const { status, data: res } = await myAxios[method](
				`/articles/${item.slug}/favorite`
			)
			if (status === 200) {
				setData(res.article)
			}
		} catch (err) {
			console.log(err)
			toastError('An error occurred')
		}
	}

	const postComment = async () => {
		try {
			const { status, data: res }: AxiosResponse<{ comment: IComment }> =
				await myAxios.post(`articles/${name}/comments`, {
					comment: { body: cmtInput }
				})
			if (status === 200) {
				setCmts([res.comment, ...cmts])
				setCmtInput('')
			}
		} catch (err) {}
	}

	useEffect(() => {
		getData()
		getComment()
	}, [name])
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				data && (
					<Row className="justify-content-center">
						<Col xs={12} className="bg-dark">
							<Container className="py-5 text-white">
								<h2>{data.title}</h2>
								<div className="d-flex align-items-center mt-4">
									<Link to={`/profiles/${data.author.username}`}>
										<Image
											src={data.author.image}
											height={48}
											className="rounded-circle me-2"
										/>
									</Link>
									<div className="me-3">
										<Link
											className="text-white"
											to={`/profiles/${data.author.username}`}
										>
											{data.author.username}
										</Link>
										<div className="text-secondary">
											{formatTime(data.createdAt)}
										</div>
									</div>
									<div className="me-3">
										<ButtonFollowing
											following={data.author.following}
											click={handleFollow}
										/>
									</div>
									{data.favorited ? (
										<RiHeartFill
											size={30}
											className="pointer"
											onClick={() => {
												onFavorite(data)
											}}
											color="red"
										/>
									) : (
										<RiHeartLine
											size={30}
											className="pointer"
											onClick={() => {
												onFavorite(data)
											}}
										/>
									)}
									({data.favoritesCount})
								</div>
							</Container>
						</Col>
						<Col xs={12}>
							<Container
								className="fz-18 py-5 overflow-auto"
								dangerouslySetInnerHTML={{
									__html: data.body.replace(/\\n/g, ' ')
								}}
								style={{ lineHeight: 2, height: '36vh' }}
							/>
							<Container>
								{data.tagList.map((item) => (
									<Badge className="mx-1" key={item} pill bg="secondary">
										{item}
									</Badge>
								))}
								<hr />
								<div className="d-flex align-items-center justify-content-center mt-4">
									<Link to={`/profiles/${data.author.username}`}>
										<Image
											src={data.author.image}
											height={48}
											width={48}
											className="rounded-circle me-3"
										/>
									</Link>
									<div className="me-3">
										<Link
											className="text-success"
											to={`/profiles/${data.author.username}`}
										>
											{data.author.username}
										</Link>
										<div className="text-secondary">
											{formatTime(data.createdAt)}
										</div>
									</div>
									<div className="mx-5">
										<ButtonFollowing
											following={data.author.following}
											click={handleFollow}
										/>
									</div>
									{data.favorited ? (
										<RiHeartFill
											size={30}
											className="pointer"
											onClick={() => {
												onFavorite(data)
											}}
											color="red"
										/>
									) : (
										<RiHeartLine
											size={30}
											className="pointer"
											onClick={() => {
												onFavorite(data)
											}}
										/>
									)}
									({data.favoritesCount})
								</div>
							</Container>
						</Col>
						<Col xs={6} className="my-5">
							<FormControl
								as={'textarea'}
								value={cmtInput}
								onChange={(e) => {
									setCmtInput(e.target.value)
								}}
								placeholder="Write a comment..."
								className="rounded-0 outline-0"
								rows={4}
							/>
							<div className="d-flex align-items-center justify-content-between p-2 bg-opacity-50 bg-secondary">
								<Image
									src={data.author.image}
									height={40}
									width={40}
									className="rounded-circle me-3"
								/>
								<Button
									variant="success"
									className="fw-bold"
									onClick={postComment}
								>
									Post Comment
								</Button>
							</div>
							{cmts.map((item) => (
								<div key={item.id} className="mt-3 border">
									<div className="p-2">{item.body}</div>
									<div className="d-flex fz-12 align-items-center  p-2 bg-opacity-75 bg-secondary text-white">
										<Image
											src={item.author.image}
											height={30}
											width={30}
											className="rounded-circle me-2"
										/>
										<Link
											className="text-white"
											to={`/profiles/${item.author.username}`}
										>
											{item.author.username}
										</Link>
										<span className="ms-2">{formatTime(item.createdAt)}</span>
									</div>
								</div>
							))}
						</Col>
					</Row>
				)
			)}
		</>
	)
}

export default ArticleDetail
