import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardProduct } from 'src/database/entities/product.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCardProductDto } from './dto/create-card-product.dto';

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
}
