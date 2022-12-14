import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export interface CommentType {
}

export async function fetchCommentsData(payload): Promise<Comment[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${payload.fileId}/comments`;
  console.log(apiUrl);
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function postComments(payload): Promise<Comment[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...payload.Comments }),
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${payload.fileId}/comments/`;
  // console.log(payload, apiUrl);
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
