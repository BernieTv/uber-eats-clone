import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant {
	@PrimaryGeneratedColumn()
	@Field(() => Number)
	id: number;

	@Field(() => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field(() => Boolean, { defaultValue: true })
	@Column({ default: true })
	@IsBoolean()
	@IsOptional()
	isVegan: boolean;

	@Field(() => String, { defaultValue: '456' })
	@Column()
	@IsString()
	@IsOptional()
	address: string;
}
