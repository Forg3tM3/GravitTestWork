import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentInput } from "./dto/payment.input";
import { PaymentStatus } from "./payment-status.enum";
import { Payment } from "./payment.entity";
import * as _ from "lodash"
import { User } from "src/users.entity";

@Injectable()
export class PaymentService {
  constructor (
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(User) private usersRepo: Repository<User>
  ) {}

  private getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  async find(username: string): Promise<number> {
    var user = await this.usersRepo.findOne(username)
    
    if (!user) 
      return 0

    return user.amount
  }

  async updateUser(input: PaymentInput): Promise<boolean> {
    var user = await this.usersRepo.findOne(input.username)
    
    if (!user) 
      return true

    user.amount = input.amount

    await this.usersRepo.save(user)
    return true
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


    var user = await this.usersRepo.findOne(payment.username)
    
    if (!user) {
      user = new User()
      user.username = payment.username
      user.amount = payment.amount
    } else {
      user.amount += payment.amount
    }

    await this.usersRepo.save(user)
    return this.paymentRepo.save(payment)
  }

  async cancel(id: number): Promise<boolean> {
    await this.paymentRepo.delete({ id, status: PaymentStatus.WAIT })
    return true
  }
}