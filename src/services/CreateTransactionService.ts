// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import CreateCategoryIfNotExistsService from './CreateCategoryIfNotExistsService';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionRepository);
    const categoryService = new CreateCategoryIfNotExistsService();

    const category_id = await categoryService.execute({
      title: category_title,
    });

    const balance = await transactionRepo.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError("Value can't be bigger than your total balance.");
    }

    const transaction = transactionRepo.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
