import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(Payment) private readonly payments: Repository<Payment>,
		@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>
	) {}

	async createPayment(
		owner: User,
		{ restaurantId, transactionId }: CreatePaymentInput
	): Promise<CreatePaymentOutput> {
		const restaurant = await this.restaurants.findOne({ where: { id: restaurantId } });
		if (!restaurant) {
			return {
				ok: false,
				error: 'Restaurant not found.',
			};
		}
		if (restaurant.ownerId !== owner.id) {
			return {
				ok: false,
				error: 'You are not allowed to do that.',
			};
		}

		await this.payments.save(
			this.payments.create({ transactionId, user: owner, restaurant })
		);
	}
}
