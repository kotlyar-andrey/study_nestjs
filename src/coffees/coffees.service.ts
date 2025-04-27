import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Americano',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((coffee) => coffee.id === id);
    if (!coffee) {
      throw new NotFoundException(`coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: number, updateCoffeeDto: any) {
    const coffee = this.findOne(id);
    if (coffee) {
      // todo
    }
  }
  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === id);
    if (coffeeIndex > -1) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
