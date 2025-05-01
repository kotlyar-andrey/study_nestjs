import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// @UsePipes(ValidationPipe) // or @UsePipes(new ValidationPipe({configObject}))
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @UsePipes(ValidationPipe) // the same what on line 23, but only for this one method
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get('events')
  findAllEvents() {
    return this.coffeesService.findAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(id);
  }

  @Post(':id/like')
  likeCoffee(@Param('id') id: number) {
    return this.coffeesService.likeCoffee(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.coffeesService.remove(Number(id));
  }
}
