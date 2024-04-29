import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { CardProductService } from '@repository/repository/card-product/card-product.service';
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto';
import { CardProductDB } from '@repository/repository/card-product/types/card-product-db';
import { join } from 'path';

/*

марка
модель
год выпуска

*/

@Injectable()
export class TestttService {
  constructor(
    private readonly sparesService: SparesCsvService,
    private readonly cardProductService: CardProductService,
  ) {}

  async getProduct({
    brand,
    model,
    year,
  }: {
    brand: string;
    model: string;
    year: number;
  }) {
    return await this.cardProductService.findMany({
      where: { brand, model },
    });
  }

  async downloadDatabase() {
    const handleStream = async (rows: CardProductDB[]) => {
      console.log('перед бд');

      const promises = rows.map(async (row, index) => {
        if (row.year_start_production === 0) {
          row.year_start_production = 2023;
        } else if (row.year_end_production - row.year_start_production > 9) {
          row.year_start_production = row.year_end_production + 9;
        }

        if (index % 10 === 0) console.log('index', index);

        const createCardProductDto = new CreateCardProductDto(row);

        await this.cardProductService
          .create(createCardProductDto)
          // .then(() => {
          //   console.log(`строка с артиклем ${row.article} прошла в бд`)
          // })
          .catch(() => {
            console.log(
              `ERROR: строка с артиклем ${row.article} не прошла в бд`,
            );
          });
      });

      await Promise.all(promises);
    };

    await this.sparesService
      .cvsUpdate({ path: join(process.cwd(), 'data/spares.csv') })
      .then(async (rows) => {
        console.log('После парсинга CSV-файла');
        console.time('createInDatabase');
        await handleStream(rows as CardProductDB[]);
        console.log('после загрузки в бд');
        console.timeEnd('createInDatabase');
      })
      .catch((error) => {
        console.error('Произошла ошибка:', error);
      });
  }
}
