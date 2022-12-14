import {
  createAsyncThunk, createSelector, createSlice, Draft,
} from '@reduxjs/toolkit';
import {
  FilesType,
  fetchFilesData, putFilesData,
  setContentType, setColumnMapping,
} from 'services/filesAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

// Types ...
export type FilesState = {
  rows: FilesType[];
  isLoading: boolean; isPostLoading: boolean;
  isPutLoading: boolean;
  error: string | null | undefined;
};

const initialState: FilesState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  error: undefined,
};

// API Actions ...
export const fetchFiles = createAsyncThunk('getFiles', async () => fetchFilesData());
export const updateFileRequest = createAsyncThunk('putFiles', async (payload: any) => putFilesData(payload));
export const setContentTypeRequest = createAsyncThunk('setContentType', async (payload: any) => setContentType(payload));
export const setColumnMappingRequest = createAsyncThunk('setColumnMapping', async (payload: any) => setColumnMapping(payload));

// Reducers ...
export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    // Fetch Files ...
    builder.addCase(fetchFiles.pending, (state: Draft<FilesState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.isLoading = false;
      ProgressBar.done();
    });

    // Update File ...
    builder.addCase(updateFileRequest.pending, (state: Draft<FilesState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateFileRequest.fulfilled, (state, action) => {
      toast.success('File successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateFileRequest.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });

    // Set ContentType
    builder.addCase(setContentTypeRequest.pending, (state: Draft<FilesState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(setContentTypeRequest.fulfilled, (state, action) => {
      toast.success('File successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(setContentTypeRequest.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });

    // Set ContentType
    builder.addCase(setColumnMappingRequest.pending, (state: Draft<FilesState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(setColumnMappingRequest.fulfilled, (state, action) => {
      toast.success('File successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(setColumnMappingRequest.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default filesSlice.reducer;

// Selectors ...
const FilesSelector = (state) => state.files;

export const getFiles = createSelector(
  FilesSelector,
  (Files: FilesState): FilesType[] => Files.rows,
);

export const isLoadingSelector = createSelector(
  FilesSelector,
  (Files: FilesState): boolean | undefined => Files.isLoading,
);

export const isPutLoadingSelector = createSelector(
  FilesSelector,
  (Files: FilesState): boolean | undefined => Files.isPutLoading,
);

export const selectErrorMessageSelector = createSelector(
  FilesSelector,
  (Files: FilesState): string | null | undefined => Files.error,
);
