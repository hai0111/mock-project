import styles from './styles.module.scss'

const LoadingEffect = () => {
	return (
		<main className={styles.wrapper}>
			<section className={styles.loaderWrapper}>
				<div className={styles.loader}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</section>
		</main>
	)
}

export default LoadingEffect
