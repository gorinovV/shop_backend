import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Заголовок',
  productId,
  description: 'Описание теста',
  rating: 5,
};

const loginDto: AuthDto = {
  login: 'space@gorinov-vladimir.ru',
  password: 'askdjakdjk!!!!333',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let productId: string;
  let createdId: string;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    accessToken = body.accessToken;
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        productId = body.productId;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    const res = await request(app.getHttpServer()).get(
      '/review/byProduct/' + productId,
    );

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBe(1);
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    const res = await request(app.getHttpServer()).get(
      '/review/byProduct/' + new Types.ObjectId().toHexString(),
    );

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBe(0);
  });

  it('/review/create (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/review/create (DELETE) - fail', async () => {
    console.log(accessToken, 'accessToken');
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
