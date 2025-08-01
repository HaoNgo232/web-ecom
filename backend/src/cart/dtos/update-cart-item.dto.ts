import { IsNumber, IsUUID, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}
