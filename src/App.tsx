import { lazy, Suspense } from 'react'
import { Provider } from 'react-redux/es/exports'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import store from './data'
import ArticleDetail from './pages/Detail'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Loader from './pages/Loader'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Setting from './pages/Setting'

const LayoutDefault = lazy(() => import('./Layouts'))

const routers = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense fallback={<Loader />}>
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
			},
			{
				path: 'settings',
				element: <Setting />
			},
			{
				path: 'profiles/:name',
				element: <Profile />
			},
			{
				path: 'profiles/:name/favorited',
				element: <Profile />
			},
			{
				path: 'article/:name',
				element: <ArticleDetail />
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
