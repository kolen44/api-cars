import { CardProduct } from '@app/sparescsv/interface/types';

export type CardProductDBWithoutKeys = CardProduct;

export type CardProductDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
