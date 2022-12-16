import { configureStore, createSlice } from '@reduxjs/toolkit'

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

export const Loading = createSlice({
	name: 'loading',
	initialState: false,
	reducers: {
		toggleLoading: (state) => {
			state = !state
			return state
		}
	}
})

const store = configureStore({
	reducer: {
		user: User.reducer,
		loading: Loading.reducer
	}
})

export default store
