import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentInput } from "./dto/payment.input";
import { PaymentStatus } from "./payment-status.enum";
import { Payment } from "./payment.entity";
import * as _ from "lodash"

@Injectable()
export class PaymentService {
  constructor (
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>
  ) {}

  private getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  async find(username: string): Promise<Payment[]> {
    return this.paymentRepo.find({ username, status: PaymentStatus.SUCCESS })
  }

  async findOne(id: number): Promise<Payment> {
    const payment =  await this.paymentRepo.findOne(id)

    if (!payment)
      throw new NotFoundException()
    
    return payment
  }

  async afterGive(ids: number[]): Promise<Payment[]> {
    const payments = await this.paymentRepo.findByIds(ids)
    return this.paymentRepo.remove(payments)
  }

  create(input: PaymentInput): Promise<Payment> {
    const payment = new Payment()

    payment.amount = input.amount
    payment.username = input.username
    payment.status = PaymentStatus.WAIT

    return this.paymentRepo.save(payment)
  }

  async confirm(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ id, status: PaymentStatus.WAIT })

    if (!payment) throw new NotFoundException()

    payment.status = PaymentStatus.SUCCESS
    payment.amount = Math.ceil(this.getRandomArbitrary(0.7, 1.7) * payment.amount)

    return this.paymentRepo.save(payment)
  }

  async cancel(id: number): Promise<boolean> {
    await this.paymentRepo.delete({ id, status: PaymentStatus.WAIT })
    return true
  }
}