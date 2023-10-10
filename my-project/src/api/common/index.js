import { uploadAction } from '../api'

const fileUpload = params => uploadAction('/uc/api/file/fileUpload', params)

export { fileUpload }
