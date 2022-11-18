import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>
	) {}

	async getOrCreate(name: string): Promise<Category> {
		const categoryName = name.trim().toLowerCase();
		const categorySlug = categoryName.replace(/ /g, '-');
		let category = await this.categoryRepository.findOneBy({
			slug: categorySlug,
		});
		if (!category) {
			category = await this.categoryRepository.save(
				this.categoryRepository.create({ slug: categorySlug, name: categoryName })
			);
		}

		return category;
	}
}
