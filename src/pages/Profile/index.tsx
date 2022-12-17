import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai'
import { BsGrid3X3 } from 'react-icons/bs'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import { Link, useLocation, useParams } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import LoadingEffect from '../../components/LoaderEffect'
import PaginationCustom, { IPageInfo } from '../../components/Pagination'
import { formatTime } from '../../hooks/useDateTime'
import Loader from '../Loader'
import styles from './styles.module.scss'

interface IProps {
	data: IProfile
	currentUser: string | undefined
}

interface IAuthor {
	bio: null
	following: false
	image: string
	username: string
}

interface IPost {
	author: IAuthor
	body: string
	createdAt: string
	description: string
	favorited: boolean
	favoritesCount: number
	slug: string
	tagList: string[]
	title: string
}

const ProfileContainer = ({ data, currentUser }: IProps) => {
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
	data.following = true
	return (
		<Container>
			<Row className="align-items-center justify-content-center border-bottom my-0 py-5">
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
					{data.bio ? <div className="mb-4">{data.bio}</div> : null}
					<Button
						className="px-4"
						variant={data.following ? 'outline-success' : 'outline-secondary'}
					>
						{data.following ? (
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
										<div>
											<Button
												className={'rounded-circle ' + styles.like}
												variant="outline-secondary"
											>
												<Icon
													size={'1.5rem'}
													color={item.favorited ? 'red' : ''}
												/>
											</Button>
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
					<Col className="text-center mt-5 pt-5">Không có dữ liệu</Col>
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

interface IProfile {
	bio: string
	following: boolean
	image: string
	username: string
}

const Profile = () => {
	const { name } = useParams()
	const [data, setData] = useState<IProfile | null>(null)

	useEffect(() => {
		const getProfile = async () => {
			try {
				const { data } = await myAxios.get(`profiles/${name}`)
				setData(data.profile)
			} catch (err) {
				console.log(err)
			}
		}
		getProfile()
	}, [name])

	return (
		<>
			{data ? <ProfileContainer currentUser={name} data={data} /> : <Loader />}
		</>
	)
}

export default Profile
