import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryIfNotExistsService {
  public async execute({ title }: Request): Promise<string> {
    const categoryRepo = getRepository(Category);

    const existingCategory = await categoryRepo.findOne({
      where: { title },
    });

    if (!existingCategory) {
      const newCategory = categoryRepo.create({
        title,
      });
      await categoryRepo.save(newCategory);
      return newCategory.id;
    }

    return existingCategory.id;
  }
}

export default CreateCategoryIfNotExistsService;
