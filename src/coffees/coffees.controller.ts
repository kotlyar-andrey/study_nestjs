import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Res
} from '@nestjs/common';

import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    this.coffeesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body) {
    this.coffeesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.coffeesService.remove(Number(id));
  }
}
