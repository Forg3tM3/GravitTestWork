import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "./payment-status.enum";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column('float')
  amount: number

  @Column({ default: PaymentStatus.WAIT })
  status: PaymentStatus
}