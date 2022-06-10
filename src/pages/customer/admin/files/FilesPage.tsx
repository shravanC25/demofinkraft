import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { agGridFilesDTO } from 'app/utils/Helpers';

import ReactFileUploder from 'components/FileUploder/Main';
import { Column, ICellRendererParams } from 'ag-grid-community';
import { useSelector } from 'react-redux';
import ColumnMapping from 'pages/customer/reconciliation/ColumnMapping';
import { fetchFiles, getFiles } from 'state/files/filesSlice';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onFileMappingClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};
function ActionsRenderer({ params, onFileMappingClickCallback }: ActionsRendererProps) {
  const [contentType, setcontentType] = useState('Select Content Type');
  function onchange(e) {
    setcontentType(e.target.value);
  }
  return (
    <div className="d-flex justify-content-between align-items-center w-100 h-100" id="columns">
      <select className="p-8" onChange={onchange}>
        <option selected disabled>Select Content Type </option>
        <option value="Content Type : 2A">Content Type : 2A</option>
        <option value="Content Type : 2B">Content Type : 2B</option>
        <option value="Content Type : PR">Content Type : PR</option>
        <option value="Content Type : QR">Content Type : QR</option>
      </select>
      <button type="button" className="btn btn-sm btn-info" onClick={() => showModal('newCompanyModal')}>
        Column Mapping
      </button>
    </div>
  );
}

function CustomActionsToolPanel() {
  const [contentType, setcontentType] = useState('Select Content Type');
  function onchange(e) {
    setcontentType(e.target.value);
  }
  return (
    <div className="container-fluid">
      <div className="row p-2">
        <ReactFileUploder />
        <select className="p-8 mb-3" onChange={onchange}>
          <option selected disabled>Select Content Type </option>
          <option value="Content Type : 2A">Content Type : 2A</option>
          <option value="Content Type : 2B">Content Type : 2B</option>
          <option value="Content Type : PR">Content Type : PR</option>
          <option value="Content Type : QR">Content Type : QR</option>
        </select>
        <button type="button" className="btn btn-sm btn-info" onClick={() => showModal('newCompanyModal')}>
          Column Mapping
        </button>
      </div>
    </div>
  );
}

export default function FilesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const rows = useSelector(getFiles);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: `${(height)}px`,
    minHeight: '600px',
  }), [height, width]);

  const onFileMappingClickCallback = (e, params) => {
    console.log('Do Mapping or something like show a modal etc here ...');
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Files Details',
      children: [
        {
          headerName: 'Name',
          field: 'customer_file_name',
          filter: 'agNumberColumnFilter',
          editable: false,
        },
        {
          headerName: 'Type',
          field: 'file_type',
          filter: 'agTextColumnFilter',
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (<ActionsRenderer params={params} onFileMappingClickCallback={(e) => onFileMappingClickCallback(e, params)} />),
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

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: CustomActionsToolPanel,
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
    defaultToolPanel: 'customActionsTool',
  }), []);

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
    dispatch(fetchFiles());
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridFilesDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  return (
    <PageWrapper pageTitle="Files" icon="fa-solid fa-file-arrow-up">
      <div className="ag-theme-alpine grid-container-style">
        <ColumnMapping />
        <AgGridReact
          containerStyle={containerStyle}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          sideBar={sideBar}
          rowSelection="multiple"
          rowDragManaged
          rowDragMultiRow
          rowGroupPanelShow="always"
          defaultColDef={defaultColDef}
          groupDisplayType="multipleColumns"
          animateRows
          onGridReady={onGridReady}
          icons={icons}
          pagination
          onFirstDataRendered={onFirstDataRendered}
          groupIncludeFooter
          groupIncludeTotalFooter
          enableRangeSelection
          masterDetail
        />
      </div>

    </PageWrapper>
  );
}