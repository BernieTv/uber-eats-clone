import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDTO {
	@Field(() => String)
	@IsString()
	@Length(5, 10)
	name: string;

	@Field(() => Boolean)
	@IsBoolean()
	isVegan: boolean;

	@IsString()
	@Field(() => String)
	address: string;

	@Field(() => String)
	@IsString()
	ownersName: string;
}
