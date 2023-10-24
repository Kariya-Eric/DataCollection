import { getAction, postAction, putAction } from '../../api'

const getDictionaryTree = params => getAction('uc/api/dictionary/getDictionaryTree', params)
const listAll = params => postAction(`uc/api/dictionary/listAll/${params}`)
const saveList = params => postAction(`uc/api/dictionary/saveList/${params.id}`, params.data)
export { getDictionaryTree, listAll, saveList }
