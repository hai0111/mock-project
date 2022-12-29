import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import { AiFillSetting, AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai'
import { BsGrid3X3 } from 'react-icons/bs'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import LoadingEffect from '../../components/LoaderEffect'
import PaginationCustom, { IPageInfo } from '../../components/Pagination'
import IStore from '../../data/IStore'
import { toastError } from '../../hooks/toast'
import { formatTime } from '../../hooks/useDateTime'
import Loader from '../Loader'

interface IProps {
	data: IProfile
	currentUser: string | undefined
	setData(data: IProfile): void
}

export interface IPost {
	author: IProfile
	body: string
	createdAt: string
	description: string
	favorited: boolean
	favoritesCount: number
	slug: string
	tagList: string[]
	title: string
}

interface IButtonFollowProps {
	following: boolean
	click(): void
}

export const ButtonFollowing = (props: IButtonFollowProps) => {
	return (
		<Button
			className="px-4"
			variant={props.following ? 'outline-success' : 'outline-secondary'}
			onClick={props.click}
		>
			{props.following ? (
				<span className="d-inline-flex align-items-center fw-normal mb-0">
					<AiOutlineCheck className="me-2" />
					Following
				</span>
			) : (
				<span className="d-inline-flex align-items-center fw-normal mb-0">
					<AiOutlinePlus className="me-2" />
					Follow
				</span>
			)}
		</Button>
	)
}

const ProfileContainer = ({ data, currentUser, setData }: IProps) => {
	const [postList, setPostList] = useState<IPost[]>([])
	const [pageInfo, setPageInfo] = useState<IPageInfo>({
		page: 1,
		size: 9,
		total: 1
	})

	const [loading, setLoading] = useState<boolean>(true)
	const checkTab = useLocation().pathname.includes('favorited')

	const getArticles = async () => {
		setLoading(true)
		try {
			const { status, data } = await myAxios.get('articles', {
				params: {
					author: currentUser,
					limit: pageInfo.size,
					offset: (pageInfo.page - 1) * pageInfo.size
				}
			})
			if (status === 200) {
				setPostList(data.articles)
				setPageInfo({ ...pageInfo, total: data.articlesCount })
			}
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	const getFavorieds = async () => {
		setLoading(true)
		try {
			const { status, data } = await myAxios.get('articles', {
				params: {
					favorited: currentUser,
					limit: pageInfo.size,
					offset: (pageInfo.page - 1) * pageInfo.size
				}
			})
			if (status === 200) {
				setPostList(data.articles)
				setPageInfo({ ...pageInfo, total: data.articlesCount })
			}
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	const getData = () => {
		checkTab ? getFavorieds() : getArticles()
	}

	useEffect(() => {
		getData()
		// eslint-disable-next-line
	}, [currentUser, checkTab, pageInfo.page])

	const user = useSelector((store: IStore) => store.user)

	const handleFollow = async () => {
		const method = data.following ? 'delete' : 'post'
		try {
			const res: AxiosResponse<{ profile: IProfile }> = await myAxios[method](
				`profiles/${currentUser}/follow`
			)
			if (res.status === 200) {
				setData({ ...data, following: res.data.profile.following })
			}
		} catch (error) {
			toastError('An error occurred')
		}
	}

	const onFavorite = async (item: IPost) => {
		const index = postList.indexOf(item)
		const method = item.favorited ? 'delete' : 'post'
		try {
			const { status, data } = await myAxios[method](
				`/articles/${item.slug}/favorite`
			)
			if (status === 200) {
				postList[index] = data.article
				setPostList([...postList])
			}
		} catch (err) {
			toastError('An error occurred')
		}
	}

	return (
		<Container>
			<Row className="align-items-center justify-content-center border-bottom my-0 pb-3 pt-5">
				<Col
					xs="auto"
					className="d-flex align-items-center justify-content-center px-5"
				>
					<Image
						src={data.image}
						className="rounded-circle"
						width={100}
						height={100}
					/>
				</Col>
				<Col xs="auto" style={{ maxWidth: 500 }} className="">
					<div className="fw-semibold mb-0 h4 mb-2">{data.username}</div>
					{data.bio ? <div>{data.bio}</div> : null}
					{user?.username === currentUser ? (
						<Link
							to={'/settings'}
							className="btn px-4 mt-4 btn-outline-secondary d-inline-flex align-items-center"
						>
							<AiFillSetting className="me-2" /> Settings
						</Link>
					) : (
						<div className="mt-3">
							<ButtonFollowing
								following={data.following}
								click={handleFollow}
							/>
						</div>
					)}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col xs="auto" className="px-0">
					<Link
						className="text-decoration-none text-secondary p-3 d-inline-block"
						style={{
							borderTopColor: checkTab ? 'transparent' : '#000',
							borderTopWidth: 2,
							borderTopStyle: 'solid'
						}}
						to={`/profiles/${currentUser}`}
					>
						<BsGrid3X3 className="me-2" />
						My Articles
					</Link>
				</Col>
				<Col xs="auto" className="px-0">
					<Link
						className="text-decoration-none text-secondary p-3 d-inline-block"
						style={{
							borderTopColor: checkTab ? '#000' : 'transparent',
							borderTopWidth: 2,
							borderTopStyle: 'solid'
						}}
						to={`/profiles/${currentUser}/favorited`}
					>
						<RiHeartFill className="me-2" />
						Favoried Articles
					</Link>
				</Col>
			</Row>
			<Row
				className="mt-3 align-content-start g-4 overflow-auto"
				style={{ height: '70vh' }}
			>
				{loading ? (
					<Col className="h-50">
						<LoadingEffect />
					</Col>
				) : postList.length ? (
					postList.map((item, index) => {
						const Icon = item.favorited ? RiHeartFill : RiHeartLine
						const tags = item.tagList.map((item) => (
							<Button
								size="sm"
								variant="secondary"
								disabled
								className="ms-2 rounded-pill"
								key={item}
							>
								{item}
							</Button>
						))
						return (
							<Col key={index} md={4}>
								<Card className="h-100">
									<Card.Title className="p-3 d-flex justify-content-between">
										<div className="pe-4">
											<Link
												to={`articles/${item.slug}`}
												className="limit-2 text-black text-decoration-none"
											>
												{item.title}
											</Link>
											<div className="mt-3 h6 fw-light">
												{formatTime(item.createdAt)}
											</div>
										</div>
										<div className="d-flex flex-column align-items-center">
											<Icon
												size={'1.2rem'}
												color={item.favorited ? 'red' : ''}
												className="pointer"
												onClick={() => {
													onFavorite(item)
												}}
											/>
											<span className="fz-15 d-inline-block mt-1">
												{item.favoritesCount}
											</span>
										</div>
									</Card.Title>
									<Card.Body style={{ height: 100 }}>
										<div className="limit-3">{item.description}</div>
									</Card.Body>
									<Card.Footer className="d-flex justify-content-end py-3">
										{tags.length ? tags : '# No tag'}
									</Card.Footer>
								</Card>
							</Col>
						)
					})
				) : (
					<Col className="text-center mt-5 pt-5">There are no posts yet</Col>
				)}
			</Row>
			<Row>
				<Col className="d-flex justify-content-center pt-3">
					<PaginationCustom setPageInfo={setPageInfo} pageInfo={pageInfo} />
				</Col>
			</Row>
		</Container>
	)
}

export interface IProfile {
	bio: string | null
	following: boolean
	image: string
	username: string
}

const Profile = () => {
	const { name } = useParams()
	const [data, setData] = useState<IProfile | null>(null)

	useEffect(() => {
		document.title = name as string
		const getProfile = async () => {
			try {
				const { data }: AxiosResponse<{ profile: IProfile }> =
					await myAxios.get(`profiles/${name}`)
				setData(data.profile)
			} catch (err) {
				console.log(err)
			}
		}
		getProfile()
	}, [name])

	return (
		<>
			{data ? (
				<ProfileContainer setData={setData} currentUser={name} data={data} />
			) : (
				<Loader />
			)}
		</>
	)
}

export default Profile
