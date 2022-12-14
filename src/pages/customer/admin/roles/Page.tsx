import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  readAll, isLoadingSelector, update, readAllSelector,
} from 'state/roles/slice';
import { RoleType, PolicyType as RolePolicyType } from 'services/roles';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { AggridPagination } from 'components/AggridPagination';
import { agGridDateFormatter } from 'app/utils/Helpers';
import SaveFormModal from './SaveFormModal';

const moduleName = 'Role';
const moduleTitle = 'Roles';

interface RoleAGGridType {
  id: number,
  title: string,
  policies?: Array<RolePolicyType>,
  updatedAt?: Date,
  updator?: any,
}

function agGridDTO(rows: Array<RoleType> | null): Array<RoleAGGridType> {
  if (!rows) {
    return [];
  }

  return rows.map(
    (item: RoleType) => ({
      id: item.id || -1,
      title: item.title,
      policies: item.policies,
      updatedAt: item.updatedAt,
      updator: item.updator,
    }),
  );
}

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};

function ActionsRenderer({ params, onEditClickCallback }: ActionsRendererProps) {
  return (
    <div className="d-flex btn-group align-items-center w-100 h-100">
      <button type="button" className="btn btn-sm btn-primary" onClick={(e) => onEditClickCallback(e, params)}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-success px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal(`save${moduleName}Modal`)}
        >
          <i className="fa-solid fa-circle-plus" />
          Add New
          {' '}
          {moduleName}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap refreshBtn"
          onClick={onRefreshCallback}
        >
          <i className={classNames(['fa-solid', 'fa-rotate', { 'fa-spin': isFetchLoading }])} />
          Refresh
        </button>
      </div>
    </div>
  );
}

function PoliciesRenderer() {
  return null;
}

function Page() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const rows = useSelector(readAllSelector);
  const [itemData, setItemData] = useState<RoleType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '77vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const onModalHide = useCallback(() => {
    onModalHidden(`save${moduleName}Modal`, () => {
      setItemData(null);
      dispatch(readAll());
    });
  }, []);

  const onEditClickCallback = useCallback(
    (e, params) => {
      setItemData(params.data);
      showModal(`save${moduleName}Modal`);
    },
    [],
  );

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: `${moduleTitle} Details`,
      children: [
        {
          headerName: 'Title',
          field: 'title',
          filter: 'agTextColumnFilter',
          onCellValueChanged: (event) => {
            const payload = { ...event.data };
            dispatch(update({ ...payload }));
          },
        },
        {
          headerName: 'Policies',
          field: 'policies',
          filter: 'agTextColumnFilter',
          valueGetter: PoliciesRenderer,
          editable: false,
        },
        {
          headerName: 'Updated On',
          field: 'updatedAt',
          filter: 'agTextColumnFilter',
          valueGetter: (params) => (agGridDateFormatter(params.data?.updatedAt)),
          editable: false,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer
              params={params}
              onEditClickCallback={(e) => onEditClickCallback(e, params)}
            />
          ),
          editable: false,
          filter: false,
          cellStyle: (params) => {
            if (params.value === 'Actions') {
              // mark police cells as red
              return { width: '100%', height: '100%' };
            }
            return null;
          },
        },
      ],
    },
  ]);

  const icons = useMemo<{ [key: string]: Function | string; }>(() => ({
    'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
  }), []);

  const onRefreshCallback = useCallback(() => {
     dispatch(readAll());
  }, []);

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: () => CustomActionsToolPanel(onRefreshCallback, isFetchLoading),
      },
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
  }), [isFetchLoading]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    enableRowGroup: true,
    editable: true,
    enablePivot: true,
    enableValue: true,
  }), []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    dispatch(readAll());
    onModalHide();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridDTO(rows));
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  // navigation
  const onPaginationChanged = () => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  };

  return (
    <PageWrapper pageTitle={moduleTitle} icon="fa-solid fa-building">
      <div style={containerStyle}>
        <SaveFormModal itemData={itemData} />
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={sideBar}
            // rowSelection="multiple"
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            icons={icons}
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            // enableRangeSelection
            onFirstDataRendered={onFirstDataRendered}
            masterDetail
          />
          <AggridPagination
            gridRef={gridRef}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>

    </PageWrapper>
  );
}

export default React.memo(Page);
