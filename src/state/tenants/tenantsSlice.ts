import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  TenantType, fetchTenantsData, postTenantsData, putTenantsData,
} from 'services/tenantsAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

// Types ...
type TenantsState = {
  rows: TenantType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedTenant: number | null;
  selectedTenantUuid: string | null;
  error: string | null | undefined;
};

const initialState: TenantsState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedTenant: null,
  selectedTenantUuid: null,
  error: undefined,
};

// API Actions ...
export const fetchTenants = createAsyncThunk('fetchTenants', async () => fetchTenantsData());
export const newTenantRequest = createAsyncThunk('postTenants', async (data: any) => postTenantsData({ ...data, uuid: uuidv4() }));
export const updateTenantRequest = createAsyncThunk('putCompanies', async (payload: any) => putTenantsData(payload));

// Reducers ...
export const TenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    setSelectedTenant: (state: Draft<TenantsState>, action: PayloadAction<string | number>) => {
      console.log('selected Tenant ... ', action.payload);
      const selectedTenant = state.rows.find((i) => Number(i.id) === Number(action.payload));
      state.selectedTenant = selectedTenant?.id ?? null;
      state.selectedTenantUuid = selectedTenant?.uuid ?? null;
      sessionStorage.setItem('tenantUuid', state.selectedTenantUuid || '');
      toast.success(`Workspace ${selectedTenant?.title} successfully selected.`);
    },
  },

  extraReducers(builder) {
    // Fetching Tenants ...
    builder.addCase(fetchTenants.pending, (state: Draft<TenantsState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchTenants.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchTenants.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isLoading = false;
      ProgressBar.done();
    });

    // Adding new Company ...
    builder.addCase(newTenantRequest.pending, (state: Draft<TenantsState>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(newTenantRequest.fulfilled, (state, action) => {
      toast.success('Workspace successfully created.');
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(newTenantRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPostLoading = false;
      ProgressBar.done();
    });

    // Update Tenant ...
    builder.addCase(updateTenantRequest.pending, (state: Draft<TenantsState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateTenantRequest.fulfilled, (state, action) => {
      toast.success('Workspace successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateTenantRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default TenantsSlice.reducer;

// Selectors ...
const TenantsSelector = (state) => state.tenants;

export const getTenants = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): TenantType[] => Tenants.rows,
);

export const getSelectedTenant = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): TenantType | undefined => {
    const TenantId = Tenants.selectedTenant;

    return Tenants.rows.find((i) => (i.id === TenantId));
  },
);

export const getSelectedTenantId = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): number | null => Tenants.selectedTenant,
);

export const availableTenants = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): boolean => !!Tenants.rows.length,
);

export const isPostLoadingSelector = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): boolean | undefined => Tenants.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  TenantsSelector,
  (Tenants: TenantsState): boolean | undefined => Tenants.isPutLoading,
);

// Reducer actions ...
const { setSelectedTenant } = TenantsSlice.actions;
export { setSelectedTenant };
