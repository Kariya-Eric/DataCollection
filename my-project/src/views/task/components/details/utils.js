export function handlerData(datasource, currentUser, roleList) {
  for (let i = 0; i < datasource.length; i++) {
    if (datasource[i].children.length == 0) {
      datasource[i].name = ele.formName
      datasource[i].type = '-'
    } else {
      datasource[i].name = datasource[i].formName
      datasource[i].type = '总表'
      datasource[i].children.forEach(child => {
        child.responsibleOrgName = ''
        child.type = '子表'
        child.collaborateOrgName = child.orgName
      })
      let item = JSON.parse(JSON.stringify(datasource[i]))
      datasource[i].children = buildElement(item, currentUser, roleList)
    }
  }
  return JSON.parse(JSON.stringify(datasource))
}

function buildElement(data, currentUser, roleList) {
  data.name = data.formName
  data.type = '总表'
  if (roleList.indexOf('superAdmin') > -1 || data.orgResponsibleUser == currentUser.userId || data.orgContactUser == currentUser.userId) {
    data.children.forEach(child => {
      child.responsibleOrgName = ''
      child.type = '子表'
      child.collaborateOrgName = child.orgName
    })
  } else {
    let filterData = data.children.filter(item => {
      return (
        item.orgResponsibleUser == currentUser.userId ||
        item.orgContactUser == currentUser.userId ||
        item.responsibleUserName == currentUser.username ||
        item.fillUserName == currentUser.username
      )
    })
    data.children = filterData.map(item => {
      item.responsibleOrgName = ''
      item.type = '子表'
      item.collaborateOrgName = item.orgName
      return item
    })
  }
  return data
}

// return datasource.map(ele => {
//     if (ele.children.length == 0) {
//       ele.name = ele.formName
//       ele.type = '-'
//     } else {
//       ele.name = ele.formName
//       ele.type = '总表'
//       ele.children.forEach(child => {
//         child.responsibleOrgName = ''
//         child.type = '子表'
//         child.collaborateOrgName = child.orgName
//       })
//       console.log('e', ele)
//     //   console.log('b', buildElement(ele, currentUser, roleList))
//     }
//     return ele
//   })
