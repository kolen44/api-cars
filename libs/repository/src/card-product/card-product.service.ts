import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardProduct } from 'src/database/entities/product.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
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
    if (this.cardProductRepository.count()) {
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

  async findAll(): Promise<CardProduct[]> {
    if (this.cardProductRepository.count()) {
      return await this.cardProductRepository.find();
    } else {
      return await this.cardProductRepositorySecond.find();
    }
  }

  async findMany(query: FindManyOptions<CardProduct>): Promise<CardProduct[]> {
    if (this.cardProductRepository.count()) {
      return await this.cardProductRepository.find(query);
    } else {
      return await this.cardProductRepositorySecond.find(query);
    }
  }

  async findOne(query: FindOneOptions<CardProduct>): Promise<CardProduct> {
    if (this.cardProductRepository.count()) {
      return await this.cardProductRepository.findOne(query);
    } else {
      return await this.cardProductRepositorySecond.findOne(query);
    }
  }

  async findByArticle(article: string): Promise<CardProduct> {
    return await this.findOne({ where: { article } });
  }

  async findManyByArticle(articles: string[]): Promise<CardProduct[]> {
    if (this.cardProductRepository.count()) {
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

  async updateDatabase(updateCardProductDto: UpdateCardProductDto) {
    if (this.cardProductRepository.count()) {
      return await this.cardProductRepositorySecond.save(updateCardProductDto);
    } else {
      return await this.cardProductRepository.save(updateCardProductDto);
    }
  }

  changingTransactionDatabase() {
    if (this.cardProductRepository.count()) {
      this.cardProductRepository.clear();
    } else {
      this.cardProductRepositorySecond.clear();
    }
  }

  // async update(id: number, updateCardProductDto: UpdateCardProductDto) {
  //   return `This action updates a #${id} cardProduct`;
  // }

  async removeMany(ids: number[]) {
    if (this.cardProductRepository.count()) {
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
    if (this.cardProductRepository.count()) {
      return await this.cardProductRepository.delete(id);
    } else {
      return await this.cardProductRepositorySecond.delete(id);
    }
  }

  getQueryBuilder(table?: string) {
    if (this.cardProductRepository.count()) {
      return this.cardProductRepository.createQueryBuilder(table || 'product');
    } else {
      return this.cardProductRepositorySecond.createQueryBuilder(
        table || 'product',
      );
    }
  }
}
