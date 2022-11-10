import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Mutation(() => Boolean)
	async createRestaurant(
		@Args('input') createRestaurantDTO: CreateRestaurantDTO
	): Promise<boolean> {
		try {
			await this.restaurantService.createRestaurant(createRestaurantDTO);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
