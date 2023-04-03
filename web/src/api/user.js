import request from '@/utils/request';

// User
export function getUserList(parameter) {
  return request({
    url: '/account/user/list',
    method: 'get',
    params: parameter
  });
}

export function deleteUserById(userId) {
  return request({
    url: '/account/user/delete/' + userId,
    method: 'post'
  });
}

export function updateUserStatus(userId, status) {
  return request.post('/account/user/update/status/' + userId + '/' + status);
}

export function updateUserInfo(user) {
  return request.post('/account/user/update/info', user);
}

export function createUser(user) {
  return request.post('/account/user/create', user);
}

// Role
export function createRole(role) {
  return request.post('/account/role/create', role);
}

export function updateRoleInfo(role) {
  return request.post('/account/role/update/info', role);
}

export function deleteRoleById(roleId) {
  return request({
    url: '/account/role/delete/' + roleId,
    method: 'post'
  });
}

// Permission
export function getPermissionListByQuery(parameter) {
  return request({
    url: '/account/permission/list',
    method: 'get',
    params: parameter
  });
}

export function createPermission(perm) {
  return request.post('/account/permission/create', perm);
}

export function updatePermissionInfo(perm) {
  return request.post('/account/permission/update/info', perm);
}

export function deletePermissionById(permId) {
  return request({
    url: '/account/permission/delete/' + permId,
    method: 'post'
  });
}

// Misc
export function getRoleList() {
  return request.get('/account/role/all');
}

export function getPermissionList() {
  return request.get('/account/permission/all');
}

export function getActionList() {
  return request.get('/account/action/all');
}
