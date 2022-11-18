import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurant, Category])],
	providers: [
		RestaurantsResolver,
		CategoryResolver,
		RestaurantService,
		CategoryRepository,
	],
})
export class RestaurantsModule {}
