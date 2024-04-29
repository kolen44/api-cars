import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEqual } from 'lodash';
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

  async updateByArticle(article: string, element) {
    const { year, ...newElement } = element;
    //Поиск существующего элемента в базе данных
    const existingProduct = await this.findByArticle(article);

    // Если элемент существует и его значения отличаются от переданного элемента
    if (existingProduct && !isEqual(existingProduct, newElement)) {
      // Обновляем элемент
      await this.cardProductRepository.update(
        { existingProduct: newElement },
        newElement,
      );
      return 'errror on update';
    } else if (!existingProduct) {
      // Если элемент не существует, создаем новый элемент
      const newProduct = await this.cardProductRepository.create(newElement);
      await this.cardProductRepository.save(newProduct);
      return 'create new';
    } else {
      // Если элемент существует и его значения совпадают с переданным элементом, возвращаем его без изменений
      return 'уже существует';
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
}
