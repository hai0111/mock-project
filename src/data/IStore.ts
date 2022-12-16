import { IResponseSuccess } from '../pages/Register/index'

interface IStore {
	user: IResponseSuccess | null
	loading: boolean
}

export default IStore
