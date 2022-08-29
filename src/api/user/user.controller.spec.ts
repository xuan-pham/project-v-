import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import * as request from 'supertest';

describe('UserController', () => {
    let app: INestApplication;
    let token: string;
    const host = 'http://localhost:3000';

    beforeAll(async () => {
        const apiServiceProvider = {
            provide: UserService,
            useFactory: () => ({
                index: jest.fn(() => [])
            })
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, apiServiceProvider],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });
    describe('login', () => {
        let user;
        beforeAll(async () => {
            user = await request(host).post('/auth/login').send({
                email: 'ducpx@vmodev.com',
                password: '123456'
            });
        });

        test('then it should return access token', () => {
            const data = user._body.Authentication;
            token = data;
            expect(user.statusCode).toBe(201)
            expect(user._body).toEqual({
                Authentication: expect.any(String),
            });
        });
    });
    describe('index', () => {
        let user;
        beforeAll(async () => {
            user = await request(host).get('/user?filter=xuan&page=1&limit=10').set('Authorization', `Bearer ${token}`);
        });

        test('then return all data of users', () => {
            const items = user._body;
            expect(user.statusCode).toBe(200);
            expect(user._body).toEqual(items);
        });
    });

    describe('show', () => {
        let user;
        beforeAll(async () => {
            user = await request(host).get('/user/info').set('Authorization', `Bearer ${token}`);
        });

        test('then it should return data of user', () => {
            const data = user._body;
            expect(user.statusCode).toBe(200);
            expect(user._body).toEqual(data);
        });
    });

    describe('update', () => {
        let user;
        beforeAll(async () => {
            user = await request(host).post('/user/update').send({
                phone: '0332220298'

            }).set('Authorization', `Bearer ${token}`);
        });

        test('then it should return data of user', () => {
            const data = user._body;
            expect(user.statusCode).toBe(404);
            expect(user._body).toEqual(data);
        })
    })


})