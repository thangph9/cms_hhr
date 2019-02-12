import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user', {
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function fetch() {
  return request('/api/user/fetch');
}

export async function updateUser(params) {
  return request(`/api/user/update`, {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function removeUser(params) {
  return request(`/api/user/delete/${params}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function addUser(params) {
  return request(`/api/user/add`, {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
