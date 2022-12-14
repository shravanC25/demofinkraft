import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from 'state/store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import {
  fetchGstins,
  getGstins,
} from '../state/gstins/gstinsSlice';
import { GstinsType } from '../services/gstinsAPIService';
import { getSelectedTenant } from '../state/tenants/tenantsSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useIsUserAuth = (): boolean | null => {
  const isUserAuth = isAuthenticated();
  const [isAuth, setIsAuth] = useState<boolean | null>(isUserAuth);

  const location = useLocation();

  useEffect(() => {
    setIsAuth(isUserAuth);
  }, [location]);

  return isAuth;
};

export const useWindowDimensions = () => {
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : 0;
    const height = hasWindow ? window.innerHeight : 0;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    return () => {

    };
  }, [hasWindow]);

  return windowDimensions;
};

export const useCustomerTopMenuHeightDimension = () => {
  const [menuHeight, setMenuHeight] = useState<number>(0);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const h = document.getElementById('customer-top-menu')?.clientHeight;
    if (h) {
      setMenuHeight(h);
    } else {
      setMenuHeight(0);
    }
  }, [width, height]);

  return menuHeight;
};

export const useGstins = () => {
  const dispatch = useAppDispatch();

  const [customerGstins, setCustomerGstins] = useState<GstinsType[]>([]);
  const selectedCustomer = useSelector(getSelectedTenant);
  const getAllGstins = useSelector(getGstins);

  useEffect(() => {
    dispatch(fetchGstins());
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const selectedCustomerGstins = getAllGstins.filter((i) => i.tenantId === Number(selectedCustomer.id));
      setCustomerGstins(selectedCustomerGstins);
    }
  }, [getAllGstins]);

  return customerGstins;
};
