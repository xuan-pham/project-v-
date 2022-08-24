import { Controller, Get, Request } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get()
  search(@Request() req) {
    return this.searchService.findAll(req);
  }
}
