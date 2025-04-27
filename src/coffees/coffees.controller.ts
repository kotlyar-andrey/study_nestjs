import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Res
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  private coffeesList = Array.from(
    { length: 20 },
    (_, index) => `coffee #${index + 1}`,
  );

  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return this.coffeesList.slice(offset * limit, (Number(offset) + 1) * limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesList[id];
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    this.coffeesList[id] = body;
    return this.coffeesList[id];
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.coffeesList.splice(id, 1);
  }
}
