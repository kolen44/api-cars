import { CardProductSecondFile } from '@app/sparescsv/interface/cvssecond(101)';

export type CardProductDBWithoutKeys = CardProductSecondFile;

export type CardProductSecondFileDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
