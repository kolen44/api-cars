import { Injectable } from '@nestjs/common'
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto'
import { CardProductDB } from '@repository/repository/card-product/types/card-product-db'
import { SparesCsvService } from '@sparescsv/sparescsv'
import { CardProductService } from '../libs/repository/src/card-product/card-product.service'

@Injectable()
export class AppService {
  constructor(
    private readonly cardProductService: CardProductService,
    private readonly sparesCsvService: SparesCsvService,
  ) {}

  public testFindAll() {
    // TODO Удалить
    return this.cardProductService.findAll()
  }

  public testFindOne() {
    // TODO Удалить
    return this.cardProductService.findByArticle('71G21E701_A33948')
  }

  public async testCreate() {
    // TODO Удалить
    // Сука не удалять пока рабита не будет
    const handleStream = async (rows: CardProductDB[]) => {
      console.log('перед бд')

      const promises = rows.map(async (row, index) => {
        if (row.year_start_production === 0) {
          row.year_start_production = 2023
        } else if (row.year_end_production - row.year_start_production > 9) {
          row.year_start_production = row.year_end_production + 9
        }

        if (index % 10 === 0) console.log('index', index)

        const createCardProductDto = new CreateCardProductDto(row)

        await this.cardProductService
          .create(createCardProductDto)
          // .then(() => {
          //   console.log(`строка с артиклем ${row.article} прошла в бд`)
          // })
          .catch(() => {
            console.log(
              `ERROR: строка с артиклем ${row.article} не прошла в бд`,
            )
          })
      })

      await Promise.all(promises)

      // for (const row of rows) {
      //   if (row.year_start_production === 0) {
      //     row.year_start_production = 2023
      //   } else if (row.year_end_production - row.year_start_production > 9) {
      //     row.year_start_production = row.year_end_production + 9
      //   }

      //   try {
      //     const createCardProductDto = new CreateCardProductDto(row)
      //     this.cardProductService
      //       .create(createCardProductDto)
      //       .then(() => {
      //         console.log(`строка с артиклем ${row.article} прошла в бд`)
      //       })
      //       .catch(() => {
      //         console.log(
      //           `ERROR: строка с артиклем ${row.article} не прошла в бд`,
      //         )
      //       })
      //   } catch (err) {
      //     console.log(`ERROR: строка с артиклем ${row.article} не прошла в бд`)
      //     console.log('\n\nrow', row)
      //     console.log('\n\nerr', err)
      //     break
      //   }
      // }
      // console.log('после бд')
    }

    await this.sparesCsvService
      .parseCvsToJson()
      .then(async (rows) => {
        console.log('После парсинга CSV-файла')
        console.time('createInDatabase')
        await handleStream(rows as CardProductDB[])
        console.log('после загрузки в бд')
        console.timeEnd('createInDatabase')
      })
      .catch((error) => {
        console.error('Произошла ошибка:', error)
      })

    // fsReadStream.on('end', (data) => {
    //   console.log(data)
    // })

    // const createCardProductDto = new CreateCardProductDto({
    //   article: 'test',
    //   in_stock: 1,
    //   detail_name: 'test',
    //   included_in_unit: 'test',
    //   brand: 'test',
    //   model: 'test',
    //   version: 1,
    //   body_type: 'test',
    //   year: 2004,
    //   engine: 'test',
    //   volume: 'test',
    //   engine_type: 'test',
    //   gearbox: 'test',
    //   original_number: 'test',
    //   price: 1,
    //   for_naked: 'test',
    //   currency: 'test',
    //   discount: 1,
    //   description: 'test',
    //   year_start_production: 1,
    //   year_end_production: 1,
    //   url_photo_details: 'test',
    //   url_car_photo: 'test',
    //   video: 'test',
    //   phone: 'test',
    //   vin: 'test',
    // })
    // return await this.cardProductService.create(createCardProductDto)
  }
}
