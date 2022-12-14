import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerTopMenu from 'parts/menu/CustomerTopMenu';
import BaseFooter from 'parts/footer/BaseFooter';
import {
  fetchTenants, getTenants, getSelectedTenant, setSelectedTenant,
} from 'state/tenants/tenantsSlice';
import { fetchGstins } from 'state/gstins/gstinsSlice';
import { useAppDispatch, useGstins, useCustomerTopMenuHeightDimension } from 'app/hooks';
import { useSelector } from 'react-redux';
import { isSecondaryMenuItemVisible } from 'state/settings/settingsSlice';
import { readAll } from 'state/roles/slice';

export default function CustomerLayout() {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const tenants = useSelector(getTenants);
  const gstins: any = useGstins();
  const selectedTenant = useSelector(getSelectedTenant);
  const [menuResponsiveClass, setMenuResponsiveClass] = useState<string>('');
  const topMenuHeight = useCustomerTopMenuHeightDimension();
  const secondaryMenuItemVisible = useSelector(isSecondaryMenuItemVisible);

  // Fetch all global data that will be used across site ...
  useEffect(() => {
    // Fetch Tenants ...
    dispatch(fetchTenants());

    // Fetch Roles ...
    // dispatch(readAll());
  }, [dispatch]);

  useEffect(() => {
    if (tenants.length && !selectedTenant) {
      const tenantId = sessionStorage.getItem('tenantUuid') || tenants[0].id;

      dispatch(setSelectedTenant(tenantId));
    }
  }, [tenants]);

  // When we resize or use app in different screen sizes we need to automatically readjust some classes
  useEffect(() => {
    setMenuResponsiveClass('');

    if ((topMenuHeight === 118 && !secondaryMenuItemVisible) || (topMenuHeight === 162 && !secondaryMenuItemVisible)) {
      setMenuResponsiveClass('top-menu-responsive-1');
    }
    if ((topMenuHeight === 118 && secondaryMenuItemVisible) || (topMenuHeight === 162 && secondaryMenuItemVisible)) {
      setMenuResponsiveClass('top-menu-responsive-2');
    }
  }, [topMenuHeight, secondaryMenuItemVisible, location]);

  return (
    <>
      <header>
        <CustomerTopMenu gstins={gstins} />
      </header>
      <main className={menuResponsiveClass}>
        <Outlet />
      </main>
      <div className="b-example-divider" />
      <div className="container-fluid m-0 p-0">
        <BaseFooter />
      </div>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
}
