import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('got', () => {
	return {
		post: jest.fn(),
	};
});

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
	email: 'new@gmail.com',
	password: '789',
};

describe('UserModule (e2e)', () => {
	let app: INestApplication;
	let server: any;
	let usersRepository: Repository<User>;
	let jwtToken: string;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = module.createNestApplication();
		server = app.getHttpServer();
		usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
		await app.init();
	});

	afterAll(async () => {
		const myDataSource = new DataSource({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: String(process.env.DB_PASSWORD),
			database: process.env.DB_NAME,
			synchronize: process.env.NODE_ENV !== 'prod',
			logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
			entities: [User, Verification],
		});

		await myDataSource.initialize();
		await myDataSource.dropDatabase();
		await myDataSource.destroy();
		await server.close();
		await app.close();
	});

	describe('createAccount', () => {
		it('should create account', async () => {
			return await request(server)
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `mutation {
            createAccount(
              input: { email: "${testUser.email}", password: "${testUser.password}", role: Owner }
            ) {
              error
              ok
            }
          }`,
				})
				.expect(200)
				.expect((res) => {
					expect(res.body.data.createAccount.ok).toBe(true);
					expect(res.body.data.createAccount.error).toBe(null);
				});
		});

		it('should fail if account already exists', async () => {
			return await request(server)
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `mutation {
          createAccount(
            input: { email: "${testUser.email}", password: "${testUser.password}", role: Owner }
          ) {
            error
            ok
          }
        }`,
				})
				.expect(200)
				.expect((res) => {
					expect(res.body.data.createAccount.ok).toBe(false);
					expect(res.body.data.createAccount.error).toBe(
						'There is a user with that email already'
					);
				});
		});
	});

	describe('login', () => {
		it('should login with correct credentials', () => {
			return request(server)
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `mutation{
          login(input:{email: "${testUser.email}", password: "${testUser.password}"}){
            error
            ok
            token
          }
        }`,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: {
							data: { login },
						},
					} = res;

					expect(login.ok).toBe(true);
					expect(login.error).toBe(null);
					expect(login.token).toEqual(expect.any(String));
					jwtToken = login.token;
				});
		});

		it('should not be able to login with wrong credentials', () => {
			return request(server)
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `mutation{
          login(input:{email: "${testUser.email}", password: "${
						testUser.password + '1'
					}"}){
            error
            ok
            token
          }
        }`,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: {
							data: { login },
						},
					} = res;

					expect(login.ok).toBe(false);
					expect(login.error).toBe('Wrong password');
					expect(login.token).toBe(null);
				});
		});
	});

	describe('userProfile', () => {
		let userId: number;

		beforeAll(async () => {
			const [user] = await usersRepository.find();
			userId = user.id;
		});

		it("should see a user's profile", () => {
			return request(server)
				.post(GRAPHQL_ENDPOINT)
				.set('X-JWT', jwtToken)
				.send({
					query: `{
          userProfile(userId:${userId}) {
            error
            ok
            user{
              id
            }
          }
        }`,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: {
							data: {
								userProfile: {
									ok,
									error,
									user: { id },
								},
							},
						},
					} = res;

					expect(ok).toBe(true);
					expect(error).toBe(null);
					expect(id).toBe(userId);
				});
		});

		it('should not find a profile', () => {
			return;
		});
	});

	it.todo('me');

	it.todo('verifyEmail');

	it.todo('editProfile');
});
