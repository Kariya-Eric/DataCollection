export function handlerData(datasource) {
  return datasource.map(ele => {
    if (ele.children.length == 0) {
      ele.name = ele.formName
      ele.type = '-'
    } else {
      ele.name = ele.formName
      ele.type = '总表'
      ele.children.forEach(child => {
        child.responsibleOrgName = ''
        child.type = '子表'
        child.collaborateOrgName = child.orgName
      })
    }
    return ele
  })
}
