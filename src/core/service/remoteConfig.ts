import { type FeatureFlagKey, type FeatureFlags } from '@/shared/types/feature-types';
import {
    type RemoteConfig,
    remoteConfigKey,
    remoteConfigRefreshRegex,
} from '@/shared/utils/cache-data-keys';

import { getValidData, registerRefreshListener, setCachedData } from '../utils/data-cache';

import openapi from './openapi';

class RemoteConfigService {
  init = async () => {
    registerRefreshListener(remoteConfigRefreshRegex, this.loadRemoteConfig);
  };

  loadRemoteConfig = async (): Promise<RemoteConfig> => {
    try {
      const result = await openapi.sendRequest(
        'GET',
        process.env.API_CONFIG_PATH,
        {},
        {},
        process.env.API_BASE_URL
      );

      // Check if result is valid JSON and not webpack output
      if (!result || typeof result === 'string' || result.constructor !== Object) {
        throw new Error('Invalid remote config response');
      }

      const config = result;
      setCachedData(remoteConfigKey(), config, 600_000); // 10 minutes
      return config;
    } catch (error) {
      // In development mode, return a minimal valid config to allow the app to work
      if (process.env.NODE_ENV === 'development') {
        console.warn('Remote config failed, using default config in development:', error);
        const defaultConfig: RemoteConfig = {
          version: '1.0.0-dev',
          config: {
            features: {},
            payer: {
              mainnet: { address: '', keyId: 0 },
              testnet: { address: '', keyId: 0 },
              previewnet: { address: '', keyId: 0 },
              sandboxnet: { address: '', keyId: 0 },
              crescendo: { address: '', keyId: 0 },
            }
          }
        };
        setCachedData(remoteConfigKey(), defaultConfig, 600_000);
        return defaultConfig;
      }
      throw error;
    }
  };

  getRemoteConfig = async (): Promise<RemoteConfig> => {
    const fullConfig = await getValidData<RemoteConfig>(remoteConfigKey());
    if (!fullConfig) {
      return this.loadRemoteConfig();
    }
    return fullConfig;
  };

  getFeatureFlags = async (): Promise<FeatureFlags> => {
    const fullConfig = await this.getRemoteConfig();
    return fullConfig.config.features;
  };

  getFeatureFlag = async (featureFlag: FeatureFlagKey): Promise<boolean> => {
    const fullConfig = await this.getRemoteConfig();
    return fullConfig.config.features[featureFlag];
  };
}

export default new RemoteConfigService();
