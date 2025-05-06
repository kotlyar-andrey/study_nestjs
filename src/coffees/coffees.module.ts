import { EventSchema } from 'src/events/entities/event.entity';

import { Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  controllers: [CoffeesController],
  // providers: [{provide: CoffeesService, useValue: new MockService()}], // MockService instead of real CoffeesService
  providers: [
    CoffeesService,
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] }, // provide array with custom name

    // { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },

    // CoffeeBrandFactory,
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (brandFactory: CoffeeBrandFactory) => brandFactory.create(),
    //   inject: [CoffeeBrandFactory],
    // }, // useFactory example

    {
      provide: COFFEE_BRANDS,
      useFactory: async (): Promise<string[]> => {
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        console.log('[!] async factory');
        return coffeeBrands;
      }, //  async useFactory example
      scope: Scope.DEFAULT,
    },

    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService, // dynamic Service depends on environment mode
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
