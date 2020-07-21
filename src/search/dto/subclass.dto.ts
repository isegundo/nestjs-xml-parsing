import { IsString } from "class-validator";

export class SubClasse {

  @IsString()
  subParam1: string
}
