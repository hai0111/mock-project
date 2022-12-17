import { useCallback, useMemo } from 'react'
import { Pagination } from 'react-bootstrap'

export interface IPageInfo {
	page: number
	total: number
	size: number
}

interface IProps {
	pageInfo: IPageInfo
	setPageInfo(pageInfo: IPageInfo): void
}

const PaginationCustom = (props: IProps) => {
	const changePage = useCallback(
		(type: number | '+' | '-') => {
			const { pageInfo } = props

			switch (type) {
				case '+':
					pageInfo.page += 1
					break
				case '-':
					pageInfo.page -= 1
					break
				default:
					pageInfo.page = type
			}
			props.setPageInfo({ ...pageInfo })
		},
		[props]
	)

	const totalPages = useMemo(
		() => Math.ceil(props.pageInfo.total / props.pageInfo.size),
		[props.pageInfo.total, props.pageInfo.size]
	)

	const pages = useMemo(() => {
		const { page } = props.pageInfo
		const pageList = []

		for (let i = 1; i <= totalPages; i++) {
			pageList.push(
				<Pagination.Item
					key={i}
					active={page === i}
					onClick={() => {
						changePage(i)
					}}
				>
					{i}
				</Pagination.Item>
			)
		}
		return pageList
	}, [props.pageInfo, changePage, totalPages])
	return (
		<>
			{pages.length > 1 ? (
				<Pagination
					onChange={(e) => {
						console.log(e)
					}}
				>
					<Pagination.Prev
						disabled={props.pageInfo.page === 1}
						onClick={() => {
							changePage('-')
						}}
					/>
					{pages}
					<Pagination.Next
						disabled={props.pageInfo.page === totalPages}
						onClick={() => {
							changePage('+')
						}}
					/>
				</Pagination>
			) : null}
		</>
	)
}

export default PaginationCustom
