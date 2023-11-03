export function handlerData(datasource, currentUser, roleList) {
  let renderDataSource = []
  datasource.forEach(ele => {
    if (ele.isCanFill) {
      let renderData = JSON.parse(JSON.stringify(ele))
      if (ele.children.length == 0) {
        renderData.name = ele.formName
        renderData.type = '-'
      } else {
        renderData.name = ele.formName
        renderData.type = '总表'
        renderData.children = ele.children
          .filter(item => item.isCanFill)
          .map(child => {
            child.responsibleOrgName = ''
            child.type = '子表'
            child.collaborateOrgName = child.orgName
            return child
          })
      }
      renderDataSource.push(renderData)
    }
  })
  return renderDataSource
}
