// 很难置信涉及权限的校验后端不返回权限数据，全部交由前端进行数据权限的校验，unbelievable

// 0 待提交
// 1 审核中
// 2 审核通过
// 3 退回修改
// -1 待配置人员

// 判断填报按钮权限
export function judgeApply(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else {
    if (row.status == 0 || row.status == 3) {
      return currentUser.username == row.fillUserName && row.type != '总表'
    }
    return false
  }
}

// 判断审核按钮权限
export function judgeAudit(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else {
    if (row.status == 1) {
      return currentUser.username == row.responsibleUserName && row.type != '总表'
    }
    return false
  }
}

// 判断查看按钮权限
export function judgeShow(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1 || roleList.indexOf('admin') > -1) {
    return true
  } else {
    if (row.responsibleUserName == currentUser.username && row.fillUserName != currentUser.username) {
      return row.status != 1 && row.status != -1 && row.type != '总表'
    } else if (row.responsibleUserName != currentUser.username && row.fillUserName == currentUser.username) {
      return row.status != 0 && row.status != 3 && row.status != -1 && row.type != '总表'
    } else if (row.responsibleUserName == currentUser.username && row.fillUserName == currentUser.username) {
      return row.status != -1 && row.type != '总表'
    }
    return true
  }
}

// 判断撤回按钮权限
export function judgeRedo(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else {
    if (row.fillUserName == currentUser.username) {
      return row.status == 1 && row.type != '总表'
    }
    return false
  }
}

// 判断催办按钮权限
export function judgeRemind(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else {
    if (roleList.indexOf('admin') > -1) {
      return row.status != 2 && row.type != '总表'
    } else {
      if (row.responsibleUserName == currentUser.username && row.fillUserName != currentUser.username) {
        return row.status == 0 || (row.status == 3 && row.type != '总表')
      } else if (row.responsibleUserName != currentUser.username && row.fillUserName == currentUser.username) {
        return false
      } else if (row.responsibleUserName == currentUser.username && row.fillUserName == currentUser.username) {
        return row.status == 0 || (row.status == 3 && row.type != '总表')
      } else {
        return row.status != 1 && row.status != 2 && row.type != '总表'
      }
    }
  }
}

// 判断填报进度按钮权限
export function judgeProgress(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else if (roleList.indexOf('admin') > -1) {
    return row.status != -1 && row.type == '总表'
  } else {
    if (row.responsibleUserName == currentUser.username && row.fillUserName != currentUser.username) {
      return row.status != -1 && row.type == '总表'
    } else if (row.responsibleUserName != currentUser.username && row.fillUserName == currentUser.username) {
      return false
    } else if (row.responsibleUserName == currentUser.username && row.fillUserName == currentUser.username) {
      return row.status != -1 && row.type == '总表'
    } else {
      return row.status != -1 && row.type == '总表'
    }
  }
}

// 判断配置人员按钮进度
export function judgeConfig(row, currentUser, roleList) {
  if (roleList.indexOf('superAdmin') > -1) {
    return true
  } else {
    return row.status == -1 && row.type != '总表'
  }
}
