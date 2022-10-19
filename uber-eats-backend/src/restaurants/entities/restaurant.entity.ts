import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
	@Field(() => String)
	name: string;

	@Field(() => Boolean)
	isVegan?: boolean;

	@Field(() => String)
	ownerName: string;
}
