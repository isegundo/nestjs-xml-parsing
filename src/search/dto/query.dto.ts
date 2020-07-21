import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FilterDto } from "./filter.dto";

export class QueryDto {
  @IsNotEmpty()
  name: string;
  notes: string;

  @ValidateNested()
  @Type(() => FilterDto)
  filter: FilterDto;
}
