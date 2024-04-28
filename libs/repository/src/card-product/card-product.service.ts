import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CardProduct } from 'src/database/entities/product.entity'
import { CreateCardProductDto } from './dto/create-card-product.dto'
import { UpdateCardProductDto } from './dto/update-card-product.dto'

@Injectable()
export class CardProductService {
  constructor(
    @InjectRepository(CardProduct)
    private readonly cardProductRepository: CardProduct,
  ) {}

  create(createCardProductDto: CreateCardProductDto) {
    return 'This action adds a new cardProduct'
  }

  findAll() {
    return `This action returns all cardProduct`
  }

  findMany() {}

  findOne(id: number) {
    return `This action returns a #${id} cardProduct`
  }

  update(id: number, updateCardProductDto: UpdateCardProductDto) {
    return `This action updates a #${id} cardProduct`
  }

  removeMany(ids: number[]) {
    return `This action removes many cardProduct`
  }

  remove(id: number) {
    return `This action removes a #${id} cardProduct`
  }
}
