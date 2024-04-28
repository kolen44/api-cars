import { Injectable } from '@nestjs/common'
import { CsvToJson } from 'classes/csvtojson/csvtojson'
import csv from 'csv-parser'
import fs from 'fs'
import { CardProduct } from 'types/types'

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

    const rows: CardProduct[] = []
    fs.createReadStream('data/spares.csv')
      .pipe(csv())
      .on('data', (row) => {
        rows.push(convertRow(row))
      })
      .on('end', () => {
        console.log(rows)
        console.log('Чтение CSV файла завершено')
      })
  }
}
