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

		if (totalPages > 5) {
			const start =
				page >= 3 && page < totalPages - 2
					? page - 2
					: page < 3
					? page - 2 + Math.abs(page - 3)
					: page - 2 + totalPages - page - 2

			const end = start + 4

			for (let i = start; i <= end; i++) {
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

			if (page > 3 && totalPages > 5) {
				pageList[0] = (
					<Pagination.Item
						key={1}
						active={page === 1}
						onClick={() => {
							changePage(1)
						}}
					>
						1
					</Pagination.Item>
				)
				pageList[1] = <Pagination.Ellipsis key={2} />
			}
			if (page < totalPages - 2 && totalPages > 5) {
				pageList[4] = (
					<Pagination.Item
						key={totalPages}
						active={page === totalPages}
						onClick={() => {
							changePage(totalPages)
						}}
					>
						{totalPages}
					</Pagination.Item>
				)
				pageList[3] = <Pagination.Ellipsis key={totalPages - 1} />
			}
		} else {
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
		}

		return pageList
	}, [props.pageInfo, changePage, totalPages])
	return (
		<>
			{totalPages > 1 ? (
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
