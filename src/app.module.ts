import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [],
  providers: [AppService],
})

export class AppModule { }
