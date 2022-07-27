import moment from 'moment';
import { CompaniesAgGridType, CompaniesType } from 'services/companiesAPIService';
import { TenantAGGridType, TenantType } from 'services/tenantsAPIService';
import { FilesAgGridType, FilesType } from 'services/filesAPIService';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function agGridDateFormatter(params) {
  return moment(params).format('LLL');
}

export function agGridCompaniesDTO(companies: CompaniesType[]): CompaniesAgGridType[] {
  return companies.map(({
    id,
    name,
    parent,
    tenantId,
    gstin,
  }) => ({
    id,
    name,
    parent,
    tenantId,
    gstin,
  }));
}

export function agGridTenantsDTO(companies: TenantType[]): TenantAGGridType[] {
  return companies.map(({
    id,
    title,
    createdAt,
    updatedAt,
  }) => ({
    id,
    title,
    createdAt,
    updatedAt,
  }));
}

export function agGridFilesDTO(items: FilesType[]): FilesAgGridType[] {
  return items.map(({
    id,
    fileName,
    fileType,
    columnMapping,
    agGridColumns,
    contentPreview,
  }) => ({
    id,
    fileName,
    fileType,
    columnMapping,
    agGridColumns,
    contentPreview,
  }));
}
