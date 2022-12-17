import styles from './styles.module.scss'

const LoadingEffect = () => {
	return (
		<main className={styles.wrapper}>
			<div className={styles.loader}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</main>
	)
}

export default LoadingEffect
