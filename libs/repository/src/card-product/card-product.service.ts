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
import { UpdateCardProductDto } from './dto/update-card-product.dto';

@Injectable()
export class CardProductService {
  constructor(
    @InjectRepository(CardProduct)
    private readonly cardProductRepository: Repository<CardProduct>,
    @InjectRepository(CardProduct)
    private readonly cardProductRepositorySecond: Repository<CardProduct>,
  ) {}

  async create(createCardProductDto: CreateCardProductDto) {
    if (this.checkWhichRepositoryBigger()) {
      const cardProduct = this.cardProductRepository.create(
        createCardProductDto.getCreateData(),
      );

      return await this.cardProductRepository.save(cardProduct);
    } else {
      const cardProduct = this.cardProductRepositorySecond.create(
        createCardProductDto.getCreateData(),
      );

      return await this.cardProductRepositorySecond.save(cardProduct);
    }
  }

  async createMany(createCardProductDto: CreateCardProductDto[]) {
    const createData = createCardProductDto.map((dto) => dto.getCreateData());
    const cardProduct = this.cardProductRepository.create(createData);
    return await this.cardProductRepository.save(cardProduct);
  }

  async findAll(): Promise<CardProduct[]> {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository.find();
    } else {
      return await this.cardProductRepositorySecond.find();
    }
  }

  async findMany(query: FindManyOptions<CardProduct>): Promise<CardProduct[]> {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository.find(query);
    } else {
      return await this.cardProductRepositorySecond.find(query);
    }
  }

  async findOne(query: FindOneOptions<CardProduct>): Promise<CardProduct> {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository.findOne(query);
    } else {
      return await this.cardProductRepositorySecond.findOne(query);
    }
  }

  async findByArticle(article: string): Promise<CardProduct> {
    return await this.findOne({ where: { article } });
  }

  async findManyByArticle(articles: string[]): Promise<CardProduct[]> {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository
        .createQueryBuilder('product')
        .where('product.article IN (:articles)', { articles })
        .getMany();
    } else {
      return await this.cardProductRepositorySecond
        .createQueryBuilder('product')
        .where('product.article IN (:articles)', { articles })
        .getMany();
    }
  }

  checkWhichRepositoryBigger() {
    if (
      this.cardProductRepository.count() &&
      this.cardProductRepositorySecond.count() &&
      this.cardProductRepository.count() >
        this.cardProductRepositorySecond.count()
    ) {
      return true;
    } else {
      return false;
    }
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
      return await this.cardProductRepositorySecond.save(updateCardProductDto);
    } catch (error) {
      return;
    }
  }

  checkFullBooleanFunction() {
    if (this.cardProductRepository.count()) {
      return 'первый репозиторий заполнен';
    } else if (this.cardProductRepositorySecond.count()) {
      return 'второй репозиторий заполнен';
    } else {
      return null;
    }
  }

  changingTransactionDatabase(checkFullBoolean: string | null) {
    // if (checkFullBoolean === 'первый репозиторий заполнен') {
    //   return this.cardProductRepository.clear();
    // } else if (checkFullBoolean === 'второй репозиторий заполнен') {
    //   return this.cardProductRepositorySecond.clear();
    // } else {
    //   return; //Если у нас второй и первый репозитории пустые то мы нечего не делаем , позволяем заполниться первому репозиторию
    // }
  }

  // async update(id: number, updateCardProductDto: UpdateCardProductDto) {
  //   return `This action updates a #${id} cardProduct`;
  // }

  async removeMany(ids: number[]) {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(ids) // Указываем массив идентификаторов для удаления
        .execute();
    } else {
      return await this.cardProductRepositorySecond
        .createQueryBuilder()
        .delete()
        .whereInIds(ids) // Указываем массив идентификаторов для удаления
        .execute();
    }
  }

  async remove(id: number) {
    if (this.checkWhichRepositoryBigger()) {
      return await this.cardProductRepository.delete(id);
    } else {
      return await this.cardProductRepositorySecond.delete(id);
    }
  }

  getQueryBuilder(table?: string) {
    if (this.checkWhichRepositoryBigger()) {
      return this.cardProductRepository.createQueryBuilder(table || 'product');
    } else {
      return this.cardProductRepositorySecond.createQueryBuilder(
        table || 'product',
      );
    }
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
    if (this.checkWhichRepositoryBigger()) {
      let result: any = await this.cardProductRepository.find({
        where: criteriaFindMany,
      });
      if (!result) {
        result = await this.cardProductRepository.findOne({
          where: criteriaFindOne,
        });
      }
      return result;
    } else {
      let result: any = await this.cardProductRepositorySecond.find({
        where: criteriaFindMany,
      });
      if (!result) {
        result = await this.cardProductRepositorySecond.findOne({
          where: criteriaFindOne,
        });
      }
      return result;
    }
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
    if (this.checkWhichRepositoryBigger()) {
      let result: any = await this.cardProductRepository.find({
        where: criteriaFindOne,
      });
      if (!result) {
        result = await this.cardProductRepository.findOne({
          where: criteria,
        });
      }
      return result;
    } else {
      let result: any = await this.cardProductRepositorySecond.find({
        where: criteriaFindOne,
      });
      if (!result) {
        result = await this.cardProductRepositorySecond.findOne({
          where: criteria,
        });
      }
      return result;
    }
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
    if (this.checkWhichRepositoryBigger()) {
      let result: any = await this.cardProductRepository.find({
        where: criteriaFindOne,
      });
      if (!result) {
        result = await this.cardProductRepository.findOne({
          where: criteria,
        });
      }
      return result;
    } else {
      let result: any = await this.cardProductRepositorySecond.find({
        where: criteriaFindOne,
      });
      if (!result) {
        result = await this.cardProductRepositorySecond.findOne({
          where: criteria,
        });
      }
      return result;
    }
  }

  async searchByWithBrandName(brand: string) {
    const criteria = {
      brand,
    };
    if (this.checkWhichRepositoryBigger()) {
      let result: any = await this.cardProductRepository.find({
        where: criteria,
      });
      if (!result) {
        result = await this.cardProductRepository.findOne({
          where: criteria,
        });
      }
      return result;
    } else {
      let result: any = await this.cardProductRepositorySecond.find({
        where: criteria,
      });
      if (!result) {
        result = await this.cardProductRepositorySecond.findOne({
          where: criteria,
        });
      }
      return result;
    }
  }

  async searchBy3Parameters(
    article: string,
    original_number: string,
    id: number,
  ) {
    const criteria: any = {};

    if (article !== undefined) {
      criteria.article = ILike(`%${article}%`);
    }
    if (original_number !== undefined) {
      criteria.original_number = ILike(`%${original_number}%`);
    }
    if (id !== undefined) {
      criteria.id = id;
    }
    if (this.checkWhichRepositoryBigger()) {
      const result = await this.cardProductRepository.find({
        where: criteria,
      });
      return result;
    } else {
      const result = await this.cardProductRepositorySecond.find({
        where: criteria,
      });
      return result;
    }
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
    if (this.checkWhichRepositoryBigger()) {
      const result = await this.cardProductRepository.find({
        where: criteria,
      });
      return result;
    } else {
      const result = await this.cardProductRepositorySecond.find({
        where: criteria,
      });
      return result;
    }
  }
}
