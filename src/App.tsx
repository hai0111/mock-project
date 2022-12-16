import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutDefault from './Layouts'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const routers = createBrowserRouter([
	{
		path: '/',
		element: <LayoutDefault />,
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
	return <RouterProvider router={routers} />
}

export default App
