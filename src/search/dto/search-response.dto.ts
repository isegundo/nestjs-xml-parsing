import { Hotel } from "../entities/hotel.entity"

export class SearchResponseDto {
  count: number
  hotels: Array<Hotel> = new Array<Hotel>()
}
