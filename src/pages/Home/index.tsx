import { useEffect, useState } from 'react'
import { Badge, Col, Container, Row } from 'react-bootstrap'
import { RiGlobalFill } from 'react-icons/ri'
import { MdOutlineArticle } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import myAxios from '../../api/myAxios'
import Article from '../../components/Article'
import LoadingEffect from '../../components/LoaderEffect'
import PaginationCustom, { IPageInfo } from '../../components/Pagination'
import Tabs, { ITab } from '../../components/Tabs'
import { IPost } from '../Profile'

const Home = () => {
	const INIT_TAB_LIST: ITab[] = [
		{
			icon: <RiGlobalFill />,
			text: 'Your Feed',
			value: 0
		},
		{
			icon: <MdOutlineArticle />,
			text: 'Global',
			value: 1
		}
	]
	const [data, setData] = useState<IPost[]>([])
	const [tagList, setTagList] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [tabs, setTabs] = useState<ITab[]>(INIT_TAB_LIST)
	const [tab, setTab] = useState<number | string>(0)

	const handleSetTab = (item: ITab) => {
		if (!tabs.includes(item)) {
			setTabs([...INIT_TAB_LIST, item])
		} else {
			setTabs(INIT_TAB_LIST)
		}
		setTab(item.value)
	}

	const [pageInfo, setPageInfo] = useState<IPageInfo>({
		page: 1,
		size: 10,
		total: 0
	})
	const getData = async () => {
		setLoading(true)
		try {
			const { size, page } = pageInfo
			const { status, data } = await myAxios.get(
				`articles/${tab === 0 ? 'feed' : ''}`,
				{
					params: {
						limit: size,
						offset: (page - 1) * size,
						tag: typeof tab === 'string' ? tab : null
					}
				}
			)
			if (status === 200) {
				setData(data.articles)
				setPageInfo({ ...pageInfo, total: data.articlesCount })
			}
		} catch (err) {
			setData([])
			setPageInfo({ ...pageInfo, page: 1, total: 0 })
		}
		setLoading(false)
	}

	useEffect(() => {
		getData()
	}, [tab])

	const getTags = async () => {
		try {
			const res = await myAxios.get('tags')
			if (res.status === 200) {
				setTagList(res.data.tags)
			}
		} catch (err) {}
	}

	const changePageInfo = (val: IPageInfo) => {
		setPageInfo(val)
		getData()
	}
	useEffect(() => {
		getTags()
		document.title = 'Home'
	}, [])

	const navigate = useNavigate()

	const onFavorite = async (item: IPost) => {
		const index = data.indexOf(item)
		const method = item.favorited ? 'delete' : 'post'
		try {
			const { status, data: res } = await myAxios[method](
				`/articles/${item.slug}/favorite`
			)
			if (status === 200) {
				data[index] = res.article
				setData([...data])
			}
		} catch (err) {
			navigate('/login')
		}
	}

	return (
		<Container className="py-5">
			<Row>
				<Col xs={8}>
					<Tabs tabs={tabs} tab={tab} setTab={handleSetTab} />
				</Col>
			</Row>
			<Row>
				<Col md={8}>
					<Row style={{ height: '75vh' }} className="overflow-auto">
						{loading ? (
							<Col xs={12}>
								<LoadingEffect />
							</Col>
						) : data.length ? (
							data.map((item) => (
								<Col key={item.title} xs={12}>
									<Article onFavorite={onFavorite} data={item} />
								</Col>
							))
						) : (
							<div className="text-center py-5 mt-5">Không có dữ liệu</div>
						)}
					</Row>
					<Row className="justify-content-center">
						<Col xs="auto" className="my-4 d-flex justify-content-center">
							{!loading && (
								<PaginationCustom
									pageInfo={pageInfo}
									setPageInfo={changePageInfo}
								/>
							)}
						</Col>
					</Row>
				</Col>
				<Col md={4}>
					{tagList.map((item, index) => (
						<Badge
							onClick={() => {
								handleSetTab({
									value: item,
									icon: '#',
									text: item
								})
							}}
							className="m-1 pointer"
							key={item}
							pill
							bg="secondary"
						>
							{item}
						</Badge>
					))}
				</Col>
			</Row>
		</Container>
	)
}

export default Home
