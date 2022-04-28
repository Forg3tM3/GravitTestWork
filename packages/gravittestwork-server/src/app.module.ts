import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { User } from './users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../../datastore.db',
      entities: [Payment, User],
      synchronize: true,
    }),
    PaymentModule
  ]
})
export class AppModule {}
