import { IsDefined, IsInt, IsString } from "class-validator";

export class PaymentInput {
  @IsDefined()
  @IsString()
  username: string

  @IsDefined()
  @IsInt()
  amount: number
}