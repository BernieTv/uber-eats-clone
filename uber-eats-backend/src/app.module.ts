import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { Dish } from './restaurants/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
			ignoreEnvFile: process.env.NODE_ENV === 'prod',
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.string().required(),
				DB_USERNAME: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				PRIVATE_KEY: Joi.string().required(),
				MAILGUN_API_KEY: Joi.string().required(),
				MAILGUN_DOMAIN_NAME: Joi.string().required(),
				MAILGUN_FROM_EMAIL: Joi.string().required(),
			}),
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			playground: process.env.NODE_ENV !== 'production',
			driver: ApolloDriver,
			installSubscriptionHandlers: true,
			autoSchemaFile: true,
			subscriptions: {
				'subscriptions-transport-ws': {
					onConnect: (connectionParams) => {
						const authToken = connectionParams['X-JWT'];

						return { token: authToken };
					},
				},
			},
			context: ({ req }) => {
				const TOKEN_KEY = 'x-jwt';

				return req && { token: req.headers[TOKEN_KEY] };
			},
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: String(process.env.DB_PASSWORD),
			database: process.env.DB_NAME,
			synchronize: process.env.NODE_ENV !== 'prod',
			logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
			entities: [
				User,
				Verification,
				Restaurant,
				Category,
				Dish,
				Order,
				OrderItem,
				Payment,
			],
		}),
		CommonModule,
		JwtModule.forRoot({
			privateKey: process.env.PRIVATE_KEY,
		}),
		MailModule.forRoot({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN_NAME,
			fromEmail: process.env.MAILGUN_FROM_EMAIL,
		}),
		AuthModule,
		UsersModule,
		RestaurantsModule,
		OrdersModule,
		PaymentsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
