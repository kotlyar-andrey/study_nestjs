import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Event } from './entities/event.entity';
import { Flavor } from './entities/flavor.entity';

// class MockService {}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  // providers: [{provide: CoffeesService, useValue: new MockService()}], // MockService instead of real CoffeesService
  providers: [
    CoffeesService,
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] }, // provide array with custom name
    // { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
    CoffeeBrandFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandFactory: CoffeeBrandFactory) => brandFactory.create(),
      inject: [CoffeeBrandFactory],
    },
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService, // dynamic Service depends on environment mode
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
