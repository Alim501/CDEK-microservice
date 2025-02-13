// {
// delivery_point
//   recipient:{
//     name:
//     phones: [
//       {
//         number: '+79134637228',
//       },
//     ],
//   }
// items: [
//   {
//     id,
//     name,
//     cost,
//     quantity,
//   },
// ];
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'ALA12 ', description: 'Код пвз' })
  @IsString({ message: 'Неверный код ПВЗ' })
  readonly delivery_point: string;
  @ApiProperty({ example: 'М.png', description: 'Параметры размера' })
  @IsString({ message: 'путь к файлу должно быть строкой' })
  @IsOptional()
  readonly img?: string;
}
