import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/role.decorator';
import {
	CreateRestaurantInput,
	CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import {
	DeleteRestaurantInput,
	DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Mutation(() => CreateRestaurantOutput)
	@Role(['Owner'])
	async createRestaurant(
		@AuthUser() authUser: User,
		@Args('input') createRestaurantInput: CreateRestaurantInput
	): Promise<CreateRestaurantOutput> {
		return this.restaurantService.createRestaurant(authUser, createRestaurantInput);
	}

	@Mutation(() => EditRestaurantOutput)
	@Role(['Owner'])
	editRestaurant(
		@AuthUser() owner: User,
		@Args('input') editRestaurantInput: EditRestaurantInput
	): Promise<EditRestaurantOutput> {
		return this.restaurantService.editRestaurant(owner, editRestaurantInput);
	}

	@Mutation(() => DeleteRestaurantOutput)
	@Role(['Owner'])
	deleteRestaurant(
		@AuthUser() owner: User,
		@Args('input') deleteRestaurantInput: DeleteRestaurantInput
	): Promise<DeleteRestaurantOutput> {
		return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput);
	}
}
