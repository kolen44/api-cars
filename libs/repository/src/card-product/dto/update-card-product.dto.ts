import { PartialType } from '@nestjs/mapped-types'
import { CreateCardProductDto } from './create-card-product.dto'

export class UpdateCardProductDto extends PartialType(CreateCardProductDto) {}
