export interface IAPIEndPoints {
  accounts: string;
  docs: string;
}

export interface IFirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  baseUrl: string;
}

export interface IAPIConfig {
  version: string;
  endpoints: IAPIEndPoints;
}

export interface IAppConfig {
  firebase: IFirebaseConfig;
}
