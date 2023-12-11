import { getAction, postAction, putAction, deleteAction } from '../../api'

const getDictionaryTree = params => getAction(`uc/api/dictionary/getDictionaryTree/${params}`)
const listAll = params => postAction(`uc/api/dictionary/listAll/${params.parentId}/${params.year}`)
const saveList = params => postAction(`uc/api/dictionary/saveList/${params.id}`, params.data)
const addOption = params => postAction('/uc/api/dictionary/add', params)
const updateOption = params => putAction('/uc/api/dictionary/update', params)
const delOption = params => deleteAction('/uc/api/dictionary/delete', params)
export { getDictionaryTree, listAll, saveList, addOption, updateOption, delOption }
