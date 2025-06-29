import { Module } from '@nestjs/common';
import { RepairsController } from './repair.controller';

@Module({
  controllers: [RepairsController],
})
export class RepairsModule {} 