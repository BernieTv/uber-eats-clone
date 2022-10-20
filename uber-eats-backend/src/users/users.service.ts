import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly users: Repository<User>,
		private readonly config: ConfigService
	) {}

	async createAccount({
		email,
		password,
		role,
	}: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
		try {
			const exists = await this.users.findOne({ where: { email } });
			if (exists) {
				return { ok: false, error: 'There is a user with that email already' };
			}
			await this.users.save(this.users.create({ email, password, role }));
			return { ok: true };
		} catch (error) {
			return { ok: true, error: "Couldn't create account" };
		}
	}

	async login({
		email,
		password,
	}: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
		try {
			const user = await this.users.findOne({ where: { email } });
			if (!user) {
				return {
					ok: false,
					error: 'User not found.',
				};
			}
			const passwordCorrect = await user.checkPassword(password);
			if (!passwordCorrect) {
				return {
					ok: false,
					error: 'Wrong password',
				};
			}
			const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
			return {
				ok: true,
				token: '11111',
			};
		} catch (error) {
			return { ok: false, error };
		}
	}
}