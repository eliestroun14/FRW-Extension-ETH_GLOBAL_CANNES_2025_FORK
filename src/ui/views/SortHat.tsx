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
  // eslint-disable-next-line prefer-const
  let [getApproval, , rejectApproval] = useApproval();

  const loadView = useCallback(async () => {
    if (isCheckingWallet) {
      console.log('Already checking wallet, skipping...');
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
        return;
      }

      let approval = await getApproval();
      if (!wallet) {
        setTo('/unlock');
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

      if (!isBooted && !isInTab) {
        // In development mode, show auto-setup component instead of redirecting
        if (process.env.NODE_ENV === 'development') {
          console.log('Wallet not booted, showing dev setup');
          setShowDevSetup(true);
          return;
        }
        openInternalPageInTab('welcome');
        return;
      }

      // Also check if wallet is booted but no current account exists
      if (!isBooted) {
        // In development mode, always show auto-setup if not booted
        if (process.env.NODE_ENV === 'development') {
          console.log('Wallet not booted (regardless of tab), showing dev setup');
          setShowDevSetup(true);
          return;
        }
      }

      const isUnlocked = await wallet.isUnlocked();
      console.log('Wallet isUnlocked:', isUnlocked);

      if (!isUnlocked) {
        setTo('/unlock');
        return;
      }

      // if ((await wallet.hasPageStateCache()) && !isInNotification && !isInTab) {
      //   const cache = await wallet.getPageStateCache()!;
      //   setTo(cache.path);
      //   return;
      // }

      const currentAccount = await wallet.getCurrentAccount();
      console.log('Current account:', currentAccount);

      if (!currentAccount) {
        // In development mode, show auto-setup component
        if (process.env.NODE_ENV === 'development') {
          console.log('No current account, showing dev setup');
          setShowDevSetup(true);
          return;
        }
        setTo('/welcome');
      } else if (approval) {
        setTo('/approval');
      } else {
        setTo('/dashboard');
      }
    } finally {
      setIsCheckingWallet(false);
    }
  }, [getApproval, rejectApproval, wallet, isCheckingWallet]);

  const handleSetupComplete = useCallback(() => {
    console.log('Setup completed, resetting state...');
    setShowDevSetup(false);
    setIsCheckingWallet(false);
    // Reload the view to check the new wallet state
    setTimeout(() => {
      loadView();
    }, 500);
  }, [loadView]);

  useEffect(() => {
    loadView();
  }, [loadView]);

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
