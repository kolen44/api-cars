import { CardProductFourthFile } from 'libs/csv-files/interface/fourthfile/csvfourth(103)';

export type CardProductDBWithoutKeys = CardProductFourthFile;

export type CardProductFourthFileDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
