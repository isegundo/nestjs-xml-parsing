import { Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { Hotel } from './entities/hotel.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class SearchService {

  async performSearch(queryDto: QueryDto): Promise<SearchResponseDto> {

    let hotels: Array<Hotel> = new Array<Hotel>()

    let a = new Hotel()
    let b = new Hotel()
    hotels.push(a, b)

    a.name = "Hotel 1"
    b.name = "Hotel 2"

    let r1 = new Room()
    let r2 = new Room()

    r1.name = 'Superior'
    r1.price = 100.10
    r2.name = 'Standard'
    r2.price = 50.05

    a.rooms.push(r1)
    a.rooms.push(r2)
    b.rooms.push(r1)
    b.rooms.push(r2)

    let mockResult = new SearchResponseDto()
    mockResult.count = 123
    mockResult.hotels = hotels

    return mockResult
  }
}
