import React from 'react'
import { Badge, Card, Image } from 'react-bootstrap'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { formatTime } from '../../hooks/useDateTime'
import { IPost } from '../../pages/Profile'

interface Iprops {
	data: IPost
	onFavorite(item: IPost): void
}

const Article = ({ data, onFavorite }: Iprops) => {
	return (
		<Card className="my-3 px-0">
			<Card.Header>
				<div className="d-flex align-items-center">
					<Image
						src={data.author.image}
						width={40}
						height={40}
						className="rounded-circle me-2"
					/>
					<div>
						<Link
							to={`/profiles/${data.author.username}`}
							className="fz-18 fw-bold text-success"
						>
							{data.author.username}
						</Link>
						<div className="fz-13">{formatTime(data.createdAt)}</div>
					</div>
					<div className="flex-grow-1"></div>
					<div className="d-inline-flex flex-column align-items-center">
						{data.favorited ? (
							<RiHeartFill
								className="pointer"
								onClick={() => {
									onFavorite(data)
								}}
								color="red"
							/>
						) : (
							<RiHeartLine
								className="pointer"
								onClick={() => {
									onFavorite(data)
								}}
							/>
						)}
						<div className="mt-1">{data.favoritesCount}</div>
					</div>
				</div>
				<Link
					to={`/article/${data.slug}`}
					className="fw-bold fz-19 mt-3 text-decoration-none text-black"
				>
					{data.title}
				</Link>
			</Card.Header>
			<Card.Body>{data.description}</Card.Body>
			<Card.Footer className="d-flex justify-content-end py-3">
				{data.tagList.map((item) => (
					<Badge className="mx-1" key={item} pill bg="secondary">
						{item}
					</Badge>
				))}
			</Card.Footer>
		</Card>
	)
}

export default React.memo(Article)
