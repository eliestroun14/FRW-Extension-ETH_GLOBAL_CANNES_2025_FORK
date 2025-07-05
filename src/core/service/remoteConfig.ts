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
      // In development mode, just return default config without making API calls
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: using default remote config');
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
      // Fallback to default config for any error
      console.warn('Remote config failed, using default config:', error);
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
