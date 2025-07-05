import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import DevAutoSetup from '@/ui/components/DevAutoSetup';
import Spin from '@/ui/components/Spin';
import { useApproval } from '@/ui/hooks/use-approval';
import { useWallet } from '@/ui/hooks/use-wallet';
import { getUiType } from '@/ui/utils';
import { openInternalPageInTab } from '@/ui/utils/webapi';

const SortHat = () => {
  const wallet = useWallet();
  const [to, setTo] = useState('');
  const [showDevSetup, setShowDevSetup] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  // eslint-disable-next-line prefer-const
  let [getApproval, , rejectApproval] = useApproval();

  const loadView = useCallback(async () => {
    if (isCheckingWallet || showDevSetup) {
      console.log('Already checking wallet or showing dev setup, skipping...');
      return;
    }

    setIsCheckingWallet(true);

    try {
      const UIType = getUiType();
      const isInNotification = UIType.isNotification;
      const isInTab = UIType.isTab;
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';

      // In demo mode, bypass wallet checks and go to dashboard
      if (isDemoMode && process.env.NODE_ENV === 'development') {
        console.log('Demo mode active, bypassing wallet checks...');
        if (isInNotification) {
          await rejectApproval();
        }
        setTo('/dashboard');
        setHasInitialized(true);
        return;
      }

      let approval = await getApproval();
      if (!wallet) {
        setTo('/unlock');
        setHasInitialized(true);
        return;
      }

      if (isInNotification && !approval) {
        window.close();
        return;
      }

      if (!isInNotification) {
        // chrome.window.windowFocusChange won't fire when
        // click popup in the meanwhile notification is present
        await rejectApproval();
        approval = undefined;
      }

      const isBooted = await wallet.isBooted();
      console.log('Wallet isBooted:', isBooted, 'isInTab:', isInTab);

      if (!isBooted) {
        // In development mode, show auto-setup component instead of redirecting
        if (process.env.NODE_ENV === 'development') {
          console.log('Wallet not booted, showing dev setup');
          setShowDevSetup(true);
          setHasInitialized(true);
          return;
        }
        if (!isInTab) {
          openInternalPageInTab('welcome');
          return;
        }
        setTo('/welcome');
        setHasInitialized(true);
        return;
      }

      const isUnlocked = await wallet.isUnlocked();
      console.log('Wallet isUnlocked:', isUnlocked);

      if (!isUnlocked) {
        setTo('/unlock');
        setHasInitialized(true);
        return;
      }

      const currentAccount = await wallet.getCurrentAccount();
      console.log('Current account:', currentAccount);

      if (!currentAccount) {
        // In development mode, show auto-setup component
        if (process.env.NODE_ENV === 'development') {
          console.log('No current account, showing dev setup');
          setShowDevSetup(true);
          setHasInitialized(true);
          return;
        }
        setTo('/welcome');
      } else if (approval) {
        setTo('/approval');
      } else {
        setTo('/dashboard');
      }
      setHasInitialized(true);
    } catch (error) {
      console.error('Error in loadView:', error);
      // If there's any error and we're in development, switch to demo mode
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem('demo_mode', 'true');
        setTo('/dashboard');
      } else {
        setTo('/welcome');
      }
      setHasInitialized(true);
    } finally {
      setIsCheckingWallet(false);
    }
  }, [getApproval, rejectApproval, wallet]);

  const handleSetupComplete = useCallback(() => {
    console.log('Setup completed, resetting state...');
    setShowDevSetup(false);
    setIsCheckingWallet(false);

    // Check if we're in demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    console.log('Demo mode check:', isDemoMode);

    if (isDemoMode) {
      console.log('Demo mode active, going to dashboard directly');
      setTo('/dashboard');
    } else {
      console.log('Not in demo mode, reloading view to check wallet state');
      // Force a refresh of the view
      setTo('');
      setTimeout(() => {
        loadView();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized) {
      loadView();
    }
  }, [loadView, hasInitialized]);

  if (showDevSetup) {
    return <DevAutoSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    // <Box sx={{}}>

    // </Box>
    // <LLSpinner size={40}>{to && <Redirect to={to} />}</LLSpinner>
    <Spin spinning={!to}>{to && <Navigate to={to} replace />}</Spin>
    // <Spin />
  );
};

export default SortHat;
