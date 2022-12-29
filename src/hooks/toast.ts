import { toast } from 'react-toastify'

export const toastSuccess = (txt: string) => {
	toast(txt, {
		className: 'bg-success text-white',
		hideProgressBar: true,
		position: 'top-right'
	})
}

export const toastError = (txt: string) => {
	toast(txt, {
		className: 'bg-danger text-white',
		hideProgressBar: true,
		position: 'top-right'
	})
}
