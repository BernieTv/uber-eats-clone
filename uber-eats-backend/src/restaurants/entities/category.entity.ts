import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
	@Field(() => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field(() => String)
	@Column()
	@IsString()
	coverImg: string;

	@Field(() => [Restaurant])
	@OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
	restaurants: Restaurant[];
}
