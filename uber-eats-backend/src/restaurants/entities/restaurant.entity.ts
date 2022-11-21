import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsString, Length, IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

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
		onDelete: 'CASCADE',
	})
	owner: User;

	@Field(() => [Order])
	@OneToMany(() => Order, (order) => order.restaurant)
	orders: Order[];

	@RelationId((restaurant: Restaurant) => restaurant.owner)
	ownerId: number;

	@Field(() => [Dish])
	@OneToMany(() => Dish, (dish) => dish.restaurant)
	menu: Dish[];
}
