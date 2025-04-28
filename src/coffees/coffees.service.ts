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

  private getNextId() {
    return (
      this.coffees.reduce(
        (current, result) => (current.id > result.id ? current : result),
        this.coffees[0],
      ).id + 1
    );
  }

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
    const nextId = this.getNextId();
    this.coffees.push({ id: nextId, ...createCoffeeDto });
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
