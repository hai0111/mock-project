export const getBase64 = async (
	f: FileList,
	success: (base64: any) => void,
	failed: (err: any) => void
) => {
	var reader = new FileReader()
	reader.readAsDataURL(f[0])
	reader.onload = function () {
		success(reader.result)
	}
	reader.onerror = function (error) {
		failed(error)
	}
}
