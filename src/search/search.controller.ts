import { Body, Controller, HttpCode, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { QueryDto } from './dto/query.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { PayloadMappingInterceptor } from './interceptors/payload-mapping.interceptor';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

  constructor(private searchService: SearchService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // TODO mover para geral?
  async search(@Body() queryDto: QueryDto): Promise<SearchResponseDto> {
    return this.searchService.performSearch(queryDto)
  }

  @Post('/xml')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  @UsePipes(new ValidationPipe({ transform: true })) // TODO mover para geral?
  @UseInterceptors(PayloadMappingInterceptor)
  async searchXml(@Body() queryDto: QueryDto) {
    return this.searchService.performSearch(queryDto)
  }
}
