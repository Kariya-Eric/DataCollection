// 0 待提交
// 1 审核中
// 2 审核通过
// 3 退回修改
// -1 待配置人员

export function judgeImport(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  }
  return row.fillUserName == currentUser.username && (row.status == 0 || row.status == 3)
}

export function judgeExport(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  }
  if (row.fillUserName == currentUser.username) {
    return row.status != -1
  }
  return row.status == 2 || row.status == 3
}

export function judgeYears(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1 || roleList.indexOf('admin') > 1) {
    return true
  }
  if (row.fillUserName != currentUser.username && row.responsibleUserName != currentUser.username) {
    return true
  }
  return row.status != -1
}

export function judgeSave(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  }
  if (row.fillUserName == currentUser.username) {
    return row.status == 0 || row.status == 3
  }
  return false
}

export function judgeRedo(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  }
  if (row.fillUserName == currentUser.username) {
    return row.status == 1
  }
  return false
}

export function judgeAuth(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  }
  if (row.responsibleUserName == currentUser.username) {
    return row.status == 1
  }
  return false
}
