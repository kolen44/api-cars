import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';

export type CardProductDBWithoutKeys = CardProductThirdFile;

export type CardProductThirdFileDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
