import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRestaurantDTO } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
	@Query(() => [Restaurant])
	restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
		return [];
	}
	@Mutation(() => Boolean)
	createRestaurant(@Args() createRestaurantDTO: CreateRestaurantDTO): boolean {
		return true;
	}
}
