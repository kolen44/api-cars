import { CardProductFifthFile } from 'libs/csv-files/interface/fifthfile/csvfifth(101)';

export type CardProductDBWithoutKeys = CardProductFifthFile;

export type CardProductFifthFileDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
