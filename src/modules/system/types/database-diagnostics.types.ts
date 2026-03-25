export type DatabaseProbeRow = {
  databaseName: string;
  currentSchema: string;
  serverVersion: string;
  executedAtUtc: Date | string;
};
