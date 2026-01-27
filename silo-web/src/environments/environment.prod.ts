// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const scheme = 'http://';
const host   = 'localhost';
const port   = ':5000';
const path   = '/api/';

// const baseUrl = scheme + host + port + path;
const baseUrl = 'https://erp-bk-staging-766078353087.us-central1.run.app/api/v1'

export const environment = {
  production      : true,
  version         : packageInfo.version,
  appName         : 'Silo',
  envName         : EnvName.PROD,
  defaultLanguage : 'en',
  apiBaseUrl      : baseUrl,
};
