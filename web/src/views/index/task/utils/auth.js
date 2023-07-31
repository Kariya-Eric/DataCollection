// 很难置信涉及权限的校验后端不返回权限数据，全部交由前端进行数据权限的校验，unbelievable

// 0 待提交
// 1 审核中
// 2 审核通过
// 3 退回修改
// -1 待配置人员

// 判断填报按钮权限
export function judgeApply(row, currentUser) {
  if (row.status == 0 || row.status == 3) {
    if (currentUser.username == row.fillUserName) {
      return true;
    }
  }
  return false;
}

// 判断审核按钮权限
export function judgeAudit(row, currentUser) {
  if (row.status == 1) {
    if (currentUser.username == row.responsibleUserName) {
      return true;
    }
  }
  return false;
}

// 判断查看按钮权限
export function judgeShow(row, currentUser, isAdmin) {
  if (isAdmin) {
    return true;
  } else {
    if (
      row.responsibleUserName == currentUser.username &&
      row.fillUserName != currentUser.username
    ) {
      return row.status != 1;
    } else if (
      row.responsibleUserName != currentUser.username &&
      row.fillUserName == currentUser.username
    ) {
      return row.status != 0 && row.status != 3;
    } else if (
      row.responsibleUserName == currentUser.username &&
      row.fillUserName == currentUser.username
    ) {
      return true;
    }
  }
  return false;
}

// 判断撤回按钮权限
export function judgeRedo(row, currentUser) {
  if (row.fillUserName == currentUser.username) {
    return row.status == 1;
  }
  return false;
}

// 判断催办按钮权限
export function judgeRemind(row, currentUser, isAdmin) {
  if (isAdmin) {
    return row.status != 2;
  } else {
    if (row.responsibleUserName == currentUser.username) {
      return row.status != 2 && row.status != 1;
    }
  }
  return false;
}

// 判断填报进度按钮权限
export function judgeProgress(row, currentUser, isAdmin) {
  if (isAdmin) {
    return row.status != -1;
  } else {
    return row.responsibleUserName == currentUser.username;
  }
}

// 判断配置人员按钮权限
export function judgeConfig(row, currentUser) {
  return true;
}