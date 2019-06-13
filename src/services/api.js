import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`, {
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function removeRule(params) {
  return request(`/api/rule?${stringify(params)}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
    },
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule`, {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}
export async function loginAccount(params) {
  return request('/api/authentication/login', {
    method: 'POST',
    body: params,
  });
}
export async function RegisterAccount(params) {
  return request('/api/authentication/register', {
    method: 'POST',
    body: params,
  });
}
export async function homeDemo() {
  return request('/api/authentication/homedemo');
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
// Track table
export async function fetchTrackByID(trackID) {
  return request(`/api/track/get/${trackID}`);
}
export async function fetchTrack(params) {
  console.log(params, 'API CALLING');
  return request(`/api/track/fetch?${stringify(params)}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function delTrack(params) {
  return request(`/api/track/fetch?${stringify(params)}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

export async function submitTrackAdd(params) {
  return request('/api/track/form/add', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function submitTrackUpdate(params) {
  return request('/api/track/form/update', {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
// Group Table
export async function submitGroup(params) {
  return request('/api/group/form/save', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function fetchGroup(params) {
  return request(`/api/group/fetch?${stringify(params)}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function removeGroup(params) {
  return request(`/api/group/remove/${params.group_id}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

// Question Table
export async function submitQuestion(params) {
  return request('/api/question/form/save', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function fetchQuestion(params) {
  return request(`/api/question/fetch?${stringify(params)}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function removeQuestion(params) {
  return request(`/api/question/remove/${params.question_id}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}

// Members Table
export async function submitMembers(params) {
  return request('/api/members/form/add', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function submitMembersUpdate(params) {
  return request('/api/members/form/update', {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function fetchMembers(params) {
  return request(`/api/members/fetch?${stringify(params)}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function fetchMembersBy(params) {
  return request(`/api/members/fetch/${params}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function delMembers(params) {
  return request(`/api/members/del?${stringify(params)}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function searchMembers(params) {
  return request(`/api/members/search?${stringify(params)}`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function lazyImages() {
  return request(`/api/image/lazy`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function uploadAudio(params) {
  const data = new FormData(params);
  return request(`/upload/audio`, {
    method: 'POST',
    body: data,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuList() {
  return request(`/api/menu/fetch`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuAdd(params) {
  return request(`/api/menu/add`, {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuUpdate(params) {
  return request(`/api/menu/update`, {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuDelete(params) {
  return request(`/api/menu/delete/${stringify(params)}`, {
    method: 'DELETE',
  });
}
//
export async function apiMenuItemList() {
  return request(`/api/menu/item/fetch`, {
    method: 'GET',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuItemAdd(params) {
  return request(`/api/menu/item/add`, {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuItemUpdate(params) {
  return request(`/api/menu/item/update`, {
    method: 'PUT',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuItemDelete(params) {
  return request(`/api/menu/item/delete?${stringify(params)}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
export async function apiMenuDeleteItem(params) {
  return request(`/api/menu/group/delete/item?${stringify(params)}`, {
    method: 'DELETE',
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
//--------------------------------------

export async function getAllUser() {
  return request(`/api/members/getalluser`, {
    method: 'GET',
  });
}
export async function deleteUser(params) {
  return request(`/api/members/delete/${params}`, {
    method: 'GET',
  });
}
export async function changePublic(params) {
  return request(`/api/members/changepublic/${params.user_id}/${params.status}`, {
    method: 'GET',
  });
}
export async function getMemberById(params) {
  return request(`/api/members/getmemberbyid/${params}`, {
    method: 'GET',
  });
}
export async function updateProfileQuestion(params) {
  return request(`/api/members/updateprofilequestion`, {
    method: 'POST',
    body: params,
  });
}
export async function updateProfileUser(params) {
  return request('/api/members/updateprofileuser', {
    method: 'POST',
    body: params,
  });
}
export async function changePass(params) {
  return request('/api/members/changepass', {
    method: 'POST',
    body: params,
  });
}
export async function updatePhone(params) {
  return request('/api/members/updatephone', {
    method: 'POST',
    body: params,
  });
}
export async function updateEmail(params) {
  return request('/api/members/updateemail', {
    method: 'POST',
    body: params,
  });
}
//
