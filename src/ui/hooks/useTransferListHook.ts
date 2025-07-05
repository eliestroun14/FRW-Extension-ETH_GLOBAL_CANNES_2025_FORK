import { useEffect, useState } from 'react';

import { transferListKey, type TransferListStore } from '@/shared/utils/cache-data-keys';
import { useWallet } from '@/ui/hooks/use-wallet';
import { useProfiles } from '@/ui/hooks/useProfileHook';

import { useCachedData } from './use-data';
import { useNetwork } from './useNetworkHook';

export const useTransferList = () => {
  const wallet = useWallet();
  const { network } = useNetwork();
  const { currentWallet } = useProfiles();

  const currentAddress = currentWallet?.address;

  const transferListStore = useCachedData<TransferListStore>(
    network && currentAddress ? transferListKey(network, currentAddress, '0', '15') : null
  );

  const [monitor, setMonitor] = useState<string | null>(null);
  const [flowscanURL, setFlowscanURL] = useState<string | null>(null);
  const [viewSourceURL, setViewSourceURL] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        // In demo mode, skip wallet calls that might fail
        const isDemoMode = localStorage.getItem('demo_mode') === 'true';
        if (isDemoMode && process.env.NODE_ENV === 'development') {
          console.log('Demo mode: skipping wallet settings fetch');
          return;
        }

        const monitor = await wallet.getMonitor();
        const url = await wallet.getFlowscanUrl();
        const viewSourceUrl = await wallet.getViewSourceUrl();
        if (mounted) {
          setMonitor(monitor);
          setFlowscanURL(url);
          setViewSourceURL(viewSourceUrl);
        }
      } catch (error) {
        console.log('Error fetching wallet settings:', error);
        // Set default values in case of error
        if (mounted) {
          setMonitor(null);
          setFlowscanURL(null);
          setViewSourceURL(null);
        }
      }
    };
    fetchSettings();
    return () => {
      mounted = false;
    };
  }, [wallet]);

  return {
    occupied: !!transferListStore?.pendingCount,
    transactions: transferListStore?.list || [],
    monitor,
    flowscanURL,
    viewSourceURL,
    loading: transferListStore === undefined,
    showButton: transferListStore && transferListStore.count > 15,
    count: transferListStore?.count,
  };
};
