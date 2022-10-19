import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDTO } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDTO) {}

@InputType()
export class UpdateRestaurantDTO {
	@Field(() => Number)
	id: number;

	@Field(() => UpdateRestaurantInputType)
	data: UpdateRestaurantInputType;
}
