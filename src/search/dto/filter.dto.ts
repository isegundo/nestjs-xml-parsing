import { Type } from "class-transformer"
import { IsArray, IsDate, IsInt, IsNotEmpty, ValidateNested } from "class-validator"
import { SubClasse } from "./subclass.dto"

export class FilterDto {
  @IsInt()
  param1: number

  @IsNotEmpty()
  param2: string

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubClasse)
  subs: SubClasse[]
}

