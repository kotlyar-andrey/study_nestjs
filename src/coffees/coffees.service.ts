import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

import { HttpException, HttpStatus, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Event } from './entities/event.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) {
      throw new NotFoundException(`coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();

    if (!existCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existCoffee;
  }

  async remove(id: string) {
    const existCoffee = await this.findOne(id);
    return existCoffee.deleteOne();
  }

  findAllEvents() {
    return this.eventModel.find().exec();
  }

  async likeCoffee(id: string) {
    const coffee = await this.findOne(id);
    const event = await this._recommendCoffee(coffee);
    return event;
  }

  async _recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
      return recommendEvent;
    } catch (err) {
      console.error('ERROR: ', err);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
