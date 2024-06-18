import { CardProduct } from 'libs/csv-files/interface/firstfile/csvfirst(165)';

export type CardProductDBWithoutKeys = CardProduct;

export type CardProductDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProductDBWithoutKeys[key]
    : never;
};
