import { CardProduct } from '@app/sparescsv/interface/types';

export type CardProductDBWithoutKeys = Omit<CardProduct, 'year'>;

export type CardProductDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProduct[key]
    : never;
};
