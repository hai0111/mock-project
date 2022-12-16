import { Provider } from 'react-redux/es/exports'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import store from './data'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Loading from './pages/Loading'

const LayoutDefault = lazy(() => import('./Layouts'))

const routers = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense fallback={<Loading />}>
				<LayoutDefault />
			</Suspense>
		),
		children: [
			{
				path: '',
				element: <Home />
			},
			{
				path: 'editor',
				element: <Editor />
			}
		]
	},
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/register',
		element: <Register />
	}
])

const App = () => {
	return (
		<Provider store={store}>
			<RouterProvider router={routers} />
		</Provider>
	)
}

export default App
