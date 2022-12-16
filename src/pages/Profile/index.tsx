import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai'
import { BsGrid3X3 } from 'react-icons/bs'
import { RiHeartFill } from 'react-icons/ri'
import { Link, useLocation, useParams } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import LoadingEffect from '../../components/LoaderEffect'
import Loader from '../Loader'

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
	const [loading, setLoading] = useState<boolean>(true)
	const checkTab = useLocation().pathname.includes('favorited')
	const getArticles = async () => {
		setLoading(true)
		try {
			const res = await myAxios.get('articles', {
				params: {
					author: currentUser
				}
			})
			console.log(res)
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	const getFavorieds = async () => {
		setLoading(true)
		try {
			const res = await myAxios.get('articles', {
				params: {
					favorited: currentUser
				}
			})
			console.log(res)
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}
	useEffect(() => {
		if (checkTab) {
			getFavorieds()
		} else {
			getArticles()
		}
	}, [checkTab, setPostList])
	return (
		<Container>
			<Row className="align-items-center justify-content-center border-bottom my-0 py-5">
				<Col
					sm={3}
					className="d-flex align-items-center justify-content-center"
				>
					<Image
						src={data.image}
						className="rounded-circle"
						width={100}
						height={100}
					/>
				</Col>
				<Col md={5}>
					<div className="d-flex align-items-center">
						<div className="fw-normal mb-0 h5 d-inline-block me-2">
							{data.username}
						</div>
						<Button variant="outline-secondary" className="ms-3">
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
					</div>
					<div className="mt-3">{data.bio}</div>
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
			<Row>
				{loading ? (
					<Col>
						<LoadingEffect />
					</Col>
				) : (
					postList.map((item, index) => (
						<Col key={index} md={4}>
							{item.title}
						</Col>
					))
				)}
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
