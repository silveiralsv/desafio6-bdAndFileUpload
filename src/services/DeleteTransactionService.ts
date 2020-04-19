// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const existTransaction = await transactionRepo.findOne(id);
    if (!existTransaction) {
      throw new AppError("Can't delete unexisting transactions");
    }

    await transactionRepo.remove(existTransaction);
  }
}

export default DeleteTransactionService;
