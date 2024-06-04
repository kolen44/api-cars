import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardProduct } from 'src/database/entities/product.entity';
import {
  FindManyOptions,
  FindOneOptions,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateCardProductDto } from './dto/create-card-product.dto';
import { UpdateCardProductSecondFIleDto } from './dto/second-file/update-card-product-second.dto';
import { UpdateCardProductDto } from './dto/update-card-product.dto';

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

  async updateDatabase(updateCardProductDto: UpdateCardProductDto) {
    try {
      const existCard = await this.cardProductRepository.findOne({
        where: {
          detail_name: updateCardProductDto.detail_name,
          article: updateCardProductDto.article,
          original_number: updateCardProductDto.original_number,
        },
      });
      if (existCard) await this.cardProductRepository.delete(existCard.id);
      const cardProduct = new CardProduct();
      cardProduct.id_writer = 165;

      // Копируем все свойства из updateCardProductDto в cardProduct
      Object.assign(cardProduct, updateCardProductDto);
      return await this.cardProductRepository.save(cardProduct);
    } catch (error) {
      return;
    }
  }

  async updateDatabaseForSecondFile(
    updateCardProductDto: UpdateCardProductSecondFIleDto,
  ) {
    try {
      // Выводим содержимое DTO для отладки
      console.log('updateCardProductDto:', updateCardProductDto);

      const existCard = await this.cardProductRepository.findOne({
        where: {
          article: updateCardProductDto.article,
          url_photo_details: updateCardProductDto.url_photo_details,
        },
      });
      if (existCard) await this.cardProductRepository.delete(existCard.id);

      const cardProduct = new CardProduct();
      Object.assign(cardProduct, updateCardProductDto);
      cardProduct.id_writer = 101;
      cardProduct.year_start_production = updateCardProductDto.year;
      cardProduct.year_end_production = updateCardProductDto.year;
      cardProduct.description = `${updateCardProductDto.description} (${updateCardProductDto.car} ${updateCardProductDto.vin})`;

      await this.cardProductRepository.save(cardProduct);

      return 'сохранено';
    } catch (error) {
      console.error('Error:', error);
      return 'ошибка';
    }
  }

  // async update(id: number, updateCardProductDto: UpdateCardProductDto) {
  //   return `This action updates a #${id} cardProduct`;
  // }

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
      detail_name: ILike(`%${detail_name}%`),
    };
    const criteriaFindOne = {
      brand,
      model: ILike(`%${model}%`),
      year,
      engine: ILike(`%${engine}%`),
      volume,
      detail_name: ILike(`%${detail_name}%`),
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
      detail_name: ILike(`%${detail_name}%`),
    };
    const criteriaFindOne = {
      brand,
      model: ILike(`%${model}%`),
      year,
      detail_name: ILike(`%${detail_name}%`),
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
      criteria.detail_name = ILike(`%${detail_name}%`);
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
