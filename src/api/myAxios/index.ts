import axios from 'axios'

const getToken = () => {
	const bearer = `Bearer ${sessionStorage.getItem('token')}`
	return bearer
}

const myAxios = axios.create({
	baseURL: 'https://api.realworld.io/api',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}
})

myAxios.interceptors.request.use((config: any) => {
	config.headers.Authorization = getToken()
	return config
})

export default myAxios
