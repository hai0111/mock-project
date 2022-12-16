import { configureStore, createSlice } from '@reduxjs/toolkit'
import { IResponseSuccess } from './../pages/Register/index'

export const User = createSlice({
	name: 'user',
	initialState: null,
	reducers: {
		setUser: (state, action) => {
			state = action.payload
			return state
		}
	}
})

export interface IStore {
	user: IResponseSuccess | null
}

const store = configureStore({
	reducer: {
		user: User.reducer
	}
})

export default store
