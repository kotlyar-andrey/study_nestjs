import { CoffeesModule } from 'src/coffees/coffees.module';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from 'src/common/interceptors/wrap-response.interceptor';
import * as request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Test coffee',
    brand: 'Test brand',
    flavors: ['test flavor1', 'test flavor 2'],
  };
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(
      new WrapResponseInterceptor(),
      new TimeoutInterceptor(),
    );

    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .set('Authorization', process.env.API_KEY || 'no_key')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
    // .then(({ body }) => {
    //   console.log('BODY: ', body);
    //   const expectedCoffee = expect.objectContaining({
    //     ...coffee,
    //     flavors: expect.arrayContaining(
    //       coffee.flavors.map((name) => expect.objectContaining({ name })),
    //     ),
    //   });
    //   console.log('BODY: ', body, expectedCoffee);
    // expect(body).toEqual(expectedCoffee);
    // });
  });
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
