import { getAction, postAction, deleteAction, putAction } from '../../api'

const getSubjectTree = params => getAction('uc/api/subject/getSubjectTree', params)
const updateSubject = params => putAction('uc/api/subject/update', params)
const addSubject = params => postAction('uc/api/subject/add', params)
const delSubject = params => deleteAction('uc/api/subject/remove', params)

export { getSubjectTree, updateSubject, addSubject, delSubject }
