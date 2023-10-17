export function handlerData(datasource, currentUser, roleList) {
  let renderDataSource = []
  datasource.forEach(ele => {
    let renderData = JSON.parse(JSON.stringify(ele))
    if (ele.children.length == 0) {
      renderData.name = ele.formName
      renderData.type = '-'
    } else {
      renderData.name = ele.formName
      renderData.type = '总表'
      if (roleList.indexOf('superAdmin') > -1 || ele.orgResponsibleUser == currentUser.userId || ele.orgContactUser == currentUser.userId) {
        renderData.children = ele.children.map(child => {
          child.responsibleOrgName = ''
          child.type = '子表'
          child.collaborateOrgName = child.orgName
          return child
        })
      } else {
        renderData.children = ele.children
          .filter(item => {
            return (
              item.orgResponsibleUser == currentUser.userId ||
              item.orgContactUser == currentUser.userId ||
              item.responsibleUserName == currentUser.username ||
              item.fillUserName == currentUser.username
            )
          })
          .map(child => {
            child.responsibleOrgName = ''
            child.type = '子表'
            child.collaborateOrgName = child.orgName
            return child
          })
      }
    }
    renderDataSource.push(renderData)
  })
  return renderDataSource
}
