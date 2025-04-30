import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Event } from './entities/event.entity';
import { Flavor } from './entities/flavor.entity';

// class MockService {}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  // providers: [{provide: CoffeesService, useValue: new MockService()}], // MockService instead of real CoffeesService
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
