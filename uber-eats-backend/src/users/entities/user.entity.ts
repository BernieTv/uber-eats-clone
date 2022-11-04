import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';

enum UserRole {
	Client,
	Owner,
	Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
	@Column({ unique: true })
	@Field(() => String)
	@IsEmail()
	email: string;

	@Column({ select: false })
	@Field(() => String)
	@IsString()
	password: string;

	@Column({ type: 'enum', enum: UserRole })
	@Field(() => UserRole)
	@IsEnum(UserRole)
	role: UserRole;

	@Column({ default: false })
	@Field(() => Boolean)
	verified: boolean;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(): Promise<void> {
		if (this.password) {
			try {
				this.password = await bcrypt.hash(this.password, 10);
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException();
			}
		}
	}

	async checkPassword(aPassword: string): Promise<boolean> {
		try {
			const ok = await bcrypt.compare(aPassword, this.password);
			return ok;
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException();
		}
	}
}
