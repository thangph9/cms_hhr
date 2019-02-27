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
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
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
export async function fetchTrackByID(trackID) {
  return request(`/api/track/get/${trackID}`);
}
export async function fetchTrack() {
  return request(`/api/track/list`);
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

export async function submitQuestion(params) {
  return request('/api/question/form/add', {
    method: 'POST',
    body: params,
    headers: { 'X-Access-Token': getAuthority()[0].token },
  });
}
