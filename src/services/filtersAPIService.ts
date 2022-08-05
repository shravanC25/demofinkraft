import { BACKEND_API } from 'app/config';
import { handleRequestError, TenantApiRequest } from '../app/utils/ApiRequests';

interface Filter {
  title: string;
  modelName?: string;
}

export interface Filters {
  createdAt?: string;
  updatedAt?: string;
  id: number;
  title: string;
  tenantId: number;
  settings: {};
  modelName?: string;
  createdBy?: string;
  updatedBy?: string;
  filter?: Filter;
}

export async function fetchFilterData(): Promise<Filters[]> {
  return TenantApiRequest('filter');
}

export async function createFilterData(payload): Promise<Filters[]> {
  return TenantApiRequest('filter', 'POST', payload);
}

export async function shareFilterData(payload): Promise<Filters[]> {
  return TenantApiRequest(`filter/share/${payload.id}`, 'POST', payload.data);
}

export async function deleteFilterData(payload): Promise<Filters[]> {
  return TenantApiRequest(`filter/${payload.id}`, 'DELETE', payload);
}

export async function getUsersInFilter(payload): Promise<any[]> {
  return TenantApiRequest(`filter/userFilter/${payload}`);
}

export async function deleteUsersInFilter(payload): Promise<any[]> {
  return TenantApiRequest(
    `filter/userFilter/${payload.filterid}/user/${payload.id}`,
    'DELETE',
  );
}

export async function fetchSharedFilterData(): Promise<Filters[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/userFilter/sharedWithMe`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}