import { CardProduct } from 'types/types'
import { cardProductKeys, cardProductNumericKeys } from './card-product-keys'

export class CsvToJson {
  public createObjectByArray(arr: string[]): CardProduct {
    const object = {}
    let index = 0

    cardProductKeys.forEach((key) => {
      const item = arr[index++]
      if (!item) return

      let value: string | number

      if (cardProductNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item)
      } else {
        value = item
      }
      object[key] = value as unknown as undefined
    })

    return object as CardProduct
  }

  public convertLine(line: string): CardProduct {
    const arr = line.replace(/"/g, '').split(';')
    return this.createObjectByArray(arr)
  }

  public convertFullFile(text: string) {
    return text
      .split('"\r\n')
      .slice(1)
      .map((line) => this.convertLine(line))
    // .slice(undefined, 1000);
  }
}
