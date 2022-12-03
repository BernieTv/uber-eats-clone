import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
	CreateRestaurantInput,
	CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import {
	DeleteRestaurantInput,
	DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsOutput, RestaurantsInput } from './dtos/restaurants.dto';
import {
	SearchRestaurantInput,
	SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
	constructor(
		@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
		@InjectRepository(Dish) private readonly dishes: Repository<Dish>,
		private readonly categories: CategoryRepository
	) {}

	async createRestaurant(
		owner: User,
		createRestaurantInput: CreateRestaurantInput
	): Promise<CreateRestaurantOutput> {
		try {
			const newRestaurant = this.restaurants.create(createRestaurantInput);
			newRestaurant.owner = owner;
			const category = await this.categories.getOrCreate(
				createRestaurantInput.categoryName
			);
			newRestaurant.category = category;
			await this.restaurants.save(newRestaurant);
			return {
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not create restaurant',
			};
		}
	}

	async editRestaurant(
		owner: User,
		editRestaurantInput: EditRestaurantInput
	): Promise<EditRestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne({
				where: { id: editRestaurantInput.restaurantId },
			});
			if (!restaurant) {
				return {
					ok: false,
					error: 'Restaurant not found.',
				};
			}
			if (owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You can't edit a restaurant that you don't own.",
				};
			}

			let category: Category = null;
			if (editRestaurantInput.categoryName) {
				category = await this.categories.getOrCreate(
					editRestaurantInput.categoryName
				);
			}
			await this.restaurants.save([
				{
					id: editRestaurantInput.restaurantId,
					...editRestaurantInput,
					...(category && { category }),
				},
			]);

			return { ok: true };
		} catch {
			return {
				ok: false,
				error: 'Could not edit Restaurant.',
			};
		}
	}

	async deleteRestaurant(
		owner: User,
		{ restaurantId }: DeleteRestaurantInput
	): Promise<DeleteRestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne({
				where: { id: restaurantId },
			});
			if (!restaurant) {
				return {
					ok: false,
					error: 'Restaurant not found.',
				};
			}
			if (owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You can't delete a restaurant that you don't own.",
				};
			}

			await this.restaurants.delete(restaurantId);

			return { ok: true };
		} catch {
			return {
				ok: false,
				error: 'Could not delete restaurant.',
			};
		}
	}

	async allCategories(): Promise<AllCategoriesOutput> {
		try {
			const categories = await this.categories.find();

			return {
				ok: true,
				categories,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not load categories',
			};
		}
	}

	async countRestaurants({ id }: Category) {
		return await this.restaurants.count({ where: { category: { id } } });
	}

	async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
		try {
			const category = await this.categories.findOne({
				where: { slug },
			});
			if (!category) {
				return {
					ok: false,
					error: 'Category not found',
				};
			}

			const { id: categoryId } = category;
			const restaurants = await this.restaurants.find({
				where: { category: { id: categoryId } },
				take: 25,
				skip: (page - 1) * 25,
				order: {
					isPromoted: 'DESC',
				},
			});
			category.restaurants = restaurants;
			const totalResults = await this.countRestaurants(category);

			return {
				ok: true,
				category,
				totalPages: Math.ceil(totalResults / 25),
			};
		} catch {
			return {
				ok: false,
				error: 'Could not load category',
			};
		}
	}

	async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
		try {
			const [restaurants, totalResults] = await this.restaurants.findAndCount({
				skip: (page - 1) * 3,
				take: 3,
				order: {
					isPromoted: 'DESC',
				},
				relations: ['category'],
			});

			return {
				ok: true,
				totalPages: Math.ceil(totalResults / 3),
				results: restaurants,
				totalResults,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not load restaurants',
			};
		}
	}

	async findRestaurantById({
		restaurantId,
	}: RestaurantInput): Promise<RestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne({
				where: { id: restaurantId },
				relations: ['menu'],
			});
			if (!restaurant) {
				return {
					ok: false,
					error: 'Restaurant not found',
				};
			}

			return {
				ok: false,
				restaurant,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not find restaurant',
			};
		}
	}

	async searchRestaurantByName({
		query,
		page,
	}: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
		try {
			const [restaurants, totalResults] = await this.restaurants.findAndCount({
				where: {
					name: Raw((name) => `${name} ILIKE '%${query}%'`),
				},
				skip: (page - 1) * 25,
				take: 25,
			});

			return {
				ok: true,
				restaurants,
				totalResults,
				totalPages: Math.ceil(totalResults / 25),
			};
		} catch {
			return { ok: false, error: 'Could not search for restaurants' };
		}
	}

	async createDish(
		owner: User,
		createDishInput: CreateDishInput
	): Promise<CreateDishOutput> {
		try {
			const restaurant = await this.restaurants.findOneBy({
				id: createDishInput.restaurantId,
			});
			if (!restaurant) {
				return {
					ok: false,
					error: 'Restaurant not found',
				};
			}
			if (owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You can't do that.",
				};
			}

			await this.dishes.save(this.dishes.create({ ...createDishInput, restaurant }));

			return { ok: true };
		} catch {
			return {
				ok: false,
				error: 'Could not create dish',
			};
		}
	}

	async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
		try {
			const dish = await this.dishes.findOne({
				where: { id: editDishInput.dishId },
				relations: ['restaurant'],
			});
			if (!dish) {
				return {
					ok: false,
					error: 'Dish not found',
				};
			}
			if (dish.restaurant.ownerId !== owner.id) {
				return {
					ok: false,
					error: "You can't do that",
				};
			}

			await this.dishes.save([
				{
					id: editDishInput.dishId,
					...editDishInput,
				},
			]);

			return {
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not edit dish',
			};
		}
	}

	async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
		try {
			const dish = await this.dishes.findOne({
				where: { id: dishId },
				relations: ['restaurant'],
			});
			if (!dish) {
				return {
					ok: false,
					error: 'Dish not found',
				};
			}
			if (dish.restaurant.ownerId !== owner.id) {
				return {
					ok: false,
					error: "You can't do that",
				};
			}
			await this.dishes.delete(dishId);

			return {
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not delete dish',
			};
		}
	}
}
