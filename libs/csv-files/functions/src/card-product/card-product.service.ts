import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCardProductFourthFIleDto } from 'libs/csv-files/constructor/fourthfile/update-card-product-fourth.dto';
import { UpdateCardProductSecondFIleDto } from 'libs/csv-files/constructor/second-file/update-card-product-second.dto';
import { UpdateCardProductThirdFIleDto } from 'libs/csv-files/constructor/thirdfile/update-card-product-third.dto';
import { CardProduct } from 'src/database/entities/product.entity';
import {
  FindManyOptions,
  FindOneOptions,
  ILike,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateCardProductDto } from '../../../constructor/firstfile/create-card-product.dto';
import { UpdateCardProductDto } from '../../../constructor/firstfile/update-card-product.dto';

@Injectable()
export class CardProductService {
  constructor(
    @InjectRepository(CardProduct)
    private readonly cardProductRepository: Repository<CardProduct>,
  ) {}

  async create(createCardProductDto: CreateCardProductDto) {
    const cardProduct = this.cardProductRepository.create(
      createCardProductDto.getCreateData(),
    );

    return await this.cardProductRepository.save(cardProduct);
  }

  async checkAndDeleteOldRecords() {
    const hundredDaysAgo = new Date();
    hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100); // Устанавливаем текущую дату минус 100 дней

    const oldRecords = await this.cardProductRepository.find({
      where: {
        createdAt: LessThan(hundredDaysAgo),
      },
    });

    await this.cardProductRepository.remove(oldRecords);
  }

  async createMany(createCardProductDto: CreateCardProductDto[]) {
    const createData = createCardProductDto.map((dto) => dto.getCreateData());
    const cardProduct = this.cardProductRepository.create(createData);
    return await this.cardProductRepository.save(cardProduct);
  }

  async findAll(): Promise<CardProduct[]> {
    return await this.cardProductRepository.find();
  }

  async findMany(query: FindManyOptions<CardProduct>): Promise<CardProduct[]> {
    return await this.cardProductRepository.find(query);
  }

  async findOne(query: FindOneOptions<CardProduct>): Promise<CardProduct> {
    return await this.cardProductRepository.findOne(query);
  }

  async findByArticle(article: string): Promise<CardProduct> {
    return await this.findOne({ where: { article } });
  }

  async findManyByArticle(articles: string[]): Promise<CardProduct[]> {
    return await this.cardProductRepository
      .createQueryBuilder('product')
      .where('product.article IN (:articles)', { articles })
      .getMany();
  }

  async updateDatabaseBatch(updateCardProductDtos: UpdateCardProductDto[]) {
    const existingCards = await this.cardProductRepository.find({
      where: updateCardProductDtos.map((dto) => ({
        detail_name: dto.detail_name,
        article: dto.article,
        original_number: dto.original_number,
      })),
    });

    const existingCardIds = existingCards.map((card) => card.id);

    // if (existingCardIds.length) {
    //   await this.cardProductRepository.delete(existingCardIds);
    // }

    const existingCardsMap = new Map();
    existingCards.forEach((card) => {
      const key = `${card.detail_name}-${card.article}-${card.original_number}`;
      existingCardsMap.set(key, card);
    });

    const cardProductsToSave = updateCardProductDtos
      .map((dto) => {
        const cardProduct = new CardProduct();
        cardProduct.id_writer = 165;
        Object.assign(cardProduct, dto);
        if (!cardProduct.year) cardProduct.year = null;
        if (!cardProduct.price) cardProduct.price = null;
        return cardProduct;
      })
      .filter((cardProduct) => {
        const key = `${cardProduct.detail_name}-${cardProduct.article}-${cardProduct.original_number}`;
        return !existingCardsMap.has(key);
      });

    return await this.cardProductRepository.save(cardProductsToSave);
  }

  async updateDatabaseForSecondFileBatch(
    updateCardProductDtos: UpdateCardProductSecondFIleDto[],
  ) {
    // Получаем существующие карточки из базы данных
    const existingCards = await this.cardProductRepository.find({
      where: updateCardProductDtos.map((dto) => ({
        detail_name: dto.detail_name,
        article: dto.article,
        original_number: dto.original_number,
      })),
    });

    // Создаем карту для быстрого поиска существующих карточек
    const existingCardsMap = new Map();
    existingCards.forEach((card) => {
      const key = `${card.detail_name}-${card.article}-${card.original_number}`;
      existingCardsMap.set(key, card);
    });

    // Создаем новые объекты карточек и фильтруем только те, которые отсутствуют в базе данных
    const cardProductsToSave = updateCardProductDtos
      .map((dto) => {
        if (dto.brand && dto.model && dto.phone && dto.detail_name) {
          const cardProduct = new CardProduct();
          cardProduct.id_writer = 101;
          Object.assign(cardProduct, dto);
          cardProduct.year_start_production = dto.year;
          cardProduct.year_end_production = dto.year;
          if (!cardProduct.year) cardProduct.year = null;
          if (!cardProduct.price) cardProduct.price = null;
          if (dto.car && dto.vin) {
            cardProduct.description = `${dto.description} (${dto.car} ${dto.vin})`;
          } else if (dto.car) {
            cardProduct.description = `${dto.description} (${dto.car})`;
          } else if (dto.vin) {
            cardProduct.description = `${dto.description} (${dto.vin})`;
          }
          if (
            cardProduct.article.length < 15 &&
            cardProduct.year !== 0 &&
            cardProduct.phone !== '0'
          ) {
            return cardProduct;
          }
        }
      })
      .filter((cardProduct) => {
        if (!cardProduct) return false; // Фильтруем undefined значения
        const key = `${cardProduct.detail_name}-${cardProduct.article}-${cardProduct.original_number}`;
        return !existingCardsMap.has(key);
      });

    return await this.cardProductRepository.save(cardProductsToSave);
  }

  async updateDatabaseForThirdFileBatch(
    updateCardProductDtos: UpdateCardProductThirdFIleDto[],
  ) {
    const existingCards = await this.cardProductRepository.find({
      where: updateCardProductDtos.map((dto) => ({
        detail_name: dto.detail_name,
        engine: dto.engine,
        original_number: dto.original_number,
      })),
    });

    const existingCardKeys = new Set(
      existingCards.map(
        (card) => `${card.detail_name}-${card.engine}-${card.original_number}`,
      ),
    );

    const newCardProducts = updateCardProductDtos
      .filter(
        (dto) =>
          dto.detail_name &&
          !existingCardKeys.has(
            `${dto.detail_name}-${dto.engine}-${dto.original_number}`,
          ),
      )
      .map((dto) => {
        const cardProduct = new CardProduct();
        Object.assign(cardProduct, dto);
        cardProduct.id_writer = 102;
        if (!cardProduct.year) cardProduct.year = null;
        if (!cardProduct.price) cardProduct.price = null;
        if (!cardProduct.phone) {
          cardProduct.phone = '+375 (29) 744-44-48, +375 (29) 644-60-60';
        }
        cardProduct.year_start_production = dto.year;
        cardProduct.year_end_production = dto.year;
        return cardProduct;
      });

    return await this.cardProductRepository.save(newCardProducts);
  }

  async updateDatabaseForFourthFileBatch(
    updateCardProductDtos: UpdateCardProductFourthFIleDto[],
  ) {
    const existingCards = await this.cardProductRepository.find({
      where: updateCardProductDtos.map((dto) => ({
        detail_name: dto.detail_name,
        engine: dto.engine,
        original_number: dto.original_number,
      })),
    });

    const existingCardKeys = new Set(
      existingCards.map(
        (card) => `${card.detail_name}-${card.engine}-${card.original_number}`,
      ),
    );

    const newCardProducts = updateCardProductDtos
      .filter(
        (dto) =>
          dto.detail_name &&
          !existingCardKeys.has(
            `${dto.detail_name}-${dto.engine}-${dto.original_number}`,
          ),
      )
      .map((dto) => {
        const cardProduct = new CardProduct();
        Object.assign(cardProduct, dto);
        cardProduct.id_writer = 102;
        if (!cardProduct.phone) {
          cardProduct.phone = '+375 (29) 311-28-98, +7 (915) 654-19-23';
        } else {
          cardProduct.phone = cardProduct.phone.replace(
            / Viber| WhatsApp| Telegram/g,
            '',
          );
        }
        let descriptionParts: string = '';

        if (dto.r_diameter) {
          descriptionParts += `R${dto.r_diameter}; `;
        }
        if (dto.j_width) {
          descriptionParts += `J${dto.j_width}; `;
        }
        if (dto.holes_number) {
          descriptionParts += `${dto.holes_number}; `;
        }
        if (dto.et_offset) {
          descriptionParts += `ET${dto.et_offset}; `;
        }
        if (dto.dia) {
          descriptionParts += `DIA${dto.dia}; `;
        }
        if (dto.pcd) {
          descriptionParts += `PCD${dto.pcd}; `;
        }

        if (descriptionParts) {
          cardProduct.description = `${descriptionParts} ${cardProduct.description}`;
        }

        if (!cardProduct.year) cardProduct.year = null;
        if (!cardProduct.price) cardProduct.price = null;
        cardProduct.year_start_production = dto.year;
        cardProduct.year_end_production = dto.year;
        return cardProduct;
      });
    return await this.cardProductRepository.save(newCardProducts);
  }

  async removeMany(ids: number[]) {
    return await this.cardProductRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(ids) // Указываем массив идентификаторов для удаления
      .execute();
  }

  async remove(id: number) {
    return await this.cardProductRepository.delete(id);
  }

  getQueryBuilder(table?: string) {
    return this.cardProductRepository.createQueryBuilder(table || 'product');
  }

  async searchByCriteria(brand: string, model: string, year: number) {
    const criteriaFindOne = {
      brand,
      model: ILike(`%${model}%`),
      year,
    };
    const criteriaFindMany = {
      brand,
      model: ILike(`%${model}%`),
      year,
      year_start_production: LessThanOrEqual(year),
      year_end_production: MoreThanOrEqual(year),
    };
    let result: any = await this.cardProductRepository.find({
      where: criteriaFindMany,
    });
    if (!result) {
      result = await this.cardProductRepository.findOne({
        where: criteriaFindOne,
      });
    }
    return result;
  }

  async searchByEngineVolumeCriteria(
    brand: string,
    model: string,
    year: number,
    engine: string,
    volume: number,
    detail_name: string,
  ) {
    const criteria = {
      brand,
      model: ILike(`%${model}%`),
      year,
      engine: ILike(`%${engine}%`),
      volume,
      detail_name: ILike(`${detail_name}%`),
    };
    const criteriaFindOne = {
      brand,
      model: ILike(`%${model}%`),
      year,
      engine: ILike(`%${engine}%`),
      volume,
      detail_name: ILike(`${detail_name}%`),
      year_start_production: LessThanOrEqual(year),
      year_end_production: MoreThanOrEqual(year),
    };
    let result: any = await this.cardProductRepository.find({
      where: criteriaFindOne,
    });
    if (!result) {
      result = await this.cardProductRepository.findOne({
        where: criteria,
      });
    }
    return result;
  }

  async searchByWithDetailName(
    brand: string,
    model: string,
    year: number,
    detail_name: string,
  ) {
    const criteria = {
      brand,
      model: ILike(`%${model}%`),
      year,
      detail_name: ILike(`${detail_name}%`),
    };
    const criteriaFindOne = {
      brand,
      model: ILike(`%${model}%`),
      year,
      detail_name: ILike(`${detail_name}%`),
      year_start_production: LessThanOrEqual(year),
      year_end_production: MoreThanOrEqual(year),
    };
    let result: any = await this.cardProductRepository.find({
      where: criteriaFindOne,
    });
    if (!result) {
      result = await this.cardProductRepository.findOne({
        where: criteria,
      });
    }
    return result;
  }

  async searchByWithBrandName(brand: string) {
    const criteria = {
      brand,
    };
    let result: any = await this.cardProductRepository.find({
      where: criteria,
    });
    if (!result) {
      result = await this.cardProductRepository.findOne({
        where: criteria,
      });
    }
    return result;
  }

  async searchBy3Parameters(
    article: string,
    original_number: number,
    id: number,
  ) {
    const criteria: any = [];

    if (article !== undefined && article !== null) {
      criteria.push({ article: ILike(`%${article}%`) });
    }
    if (original_number !== undefined && original_number !== null) {
      criteria.push({ original_number: ILike(`%${original_number}%`) });
    }
    if (id !== undefined && id !== null) {
      criteria.push({ id: id });
    }

    const result = await this.cardProductRepository.find({
      where: criteria.length ? criteria : {},
    });
    return result;
  }

  async findSparePartsByParameters(
    brand: string,
    model: string,
    year: number,
    engine: string,
    volume: number,
    detail_name: string,
  ) {
    const criteria: any = {};

    if (brand) {
      criteria.brand = ILike(`%${brand}%`);
    }
    if (model) {
      criteria.model = ILike(`%${model}%`);
    }
    if (engine) {
      criteria.engine = ILike(`%${engine}%`);
    }
    if (volume) {
      criteria.volume = volume;
    }
    if (detail_name) {
      criteria.detail_name = ILike(`${detail_name}%`);
    }
    if (year) {
      criteria.year = year;
    }
    const result = await this.cardProductRepository.find({
      where: criteria,
    });
    return result;
  }
}
