export const ReconciliationColumns = (agGridRowDrag) => [
  {
    headerName: 'ID',
    field: 'id',
    agGridRowDrag,
    filter: 'agNumberColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Customer File ID',
    field: 'customer_file_id',
    agGridRowDrag,
    filter: 'agNumberColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Workspace',
    field: 'workspace',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Invoice Number',
    field: 'invoice_number',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'seller Gstin',
    field: 'seller_gstin',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Buyer Gstin',
    field: 'buyer_gstin',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Invoice Date',
    field: 'invoice_date',
    agGridRowDrag,
    filter: 'agDateColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Filing Period',
    field: 'filing_period',
    agGridRowDrag,
    filter: 'agDateColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Document Type',
    field: 'document_type',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Original Invoice Number',
    field: 'original_invoice_number',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Original Invoice Date',
    field: 'original_invoice_date',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Total Amount',
    field: 'total_amount',
    agGridRowDrag,
    filter: 'agNumberColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'IGST',
    field: 'igst',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'SGST',
    field: 'sgst',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'CGST',
    field: 'cgst',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Total GST',
    field: 'total_gst',
    agGridRowDrag,
    filter: 'agNumberColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Taxable Amount',
    field: 'taxable_amount',
    agGridRowDrag,
    filter: 'agNumberColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Tax Rate',
    field: 'tax_rate',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Irn',
    field: 'irn',
    agGridRowDrag,
    filter: 'agTextColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Row Updated At',
    field: 'row_updated_at',
    agGridRowDrag,
    filter: 'agDateColumnFilter',
    chartDataType: 'category',
  },
  {
    headerName: 'Irn Date',
    field: 'irn_date',
    agGridRowDrag,
    filter: 'agDateColumnFilter',
    chartDataType: 'category',
  },
];
