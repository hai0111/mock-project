import moment from 'moment'

export const formatTime = (dateString: string): string => {
	return moment(
		dateString.replace(/\.w+$/, ''),
		'YYYY-MM-DDTHH:mm:ss.212Z'
	).format('MMMM DD, YYYY')
}
