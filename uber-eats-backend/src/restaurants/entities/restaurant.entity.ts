import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, Length, IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
	@Field(() => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field(() => String)
	@Column()
	@IsString()
	coverImg: string;

	@Field(() => String, { defaultValue: 'Tashkent' })
	@Column()
	@IsString()
	@IsOptional()
	address: string;

	@Field(() => Category, { nullable: true })
	@ManyToOne(() => Category, (category) => category.restaurants, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	category: Category;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.restaurants, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	owner: User;
}
