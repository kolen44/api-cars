import { Injectable } from '@nestjs/common'
import { CsvToJson } from '@sparescsv/sparescsv/classes/csvtojson/csvtojson'
import { CardProduct } from '@sparescsv/sparescsv/classes/csvtojson/types'
import * as csv from 'csv-parser'
import * as fs from 'fs'

@Injectable()
export class SparesCsvService {
  private csvToJson: CsvToJson

  constructor() {
    this.csvToJson = new CsvToJson()
  }

  public async parseCvsToJson() {
    const convertRow = (obj: Record<string, string>) => {
      let result: Partial<CardProduct> = {}

      result = this.csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      )

      return result as CardProduct
    }

    return new Promise((resolve, reject) => {
      const rows: CardProduct[] = []

      return fs
        .createReadStream('data/spares.csv')
        .pipe(csv())
        .on('data', (row) => {
          rows.push(convertRow(row))
        })
        .on('end', () => {
          resolve(rows)
          console.log(rows)
          console.log('Чтение CSV файла завершено')
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }
}
