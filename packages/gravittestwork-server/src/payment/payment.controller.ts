import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PaymentInput } from "./dto/payment.input";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentController {
  constructor (private paymentService: PaymentService) {}

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.paymentService.findOne(id)
  }

  @Get("byUsername/:username")
  find(@Param("username") username: string) {
    return this.paymentService.find(username)
  }

  @Delete(":ids")
  afterGive(@Param("ids", new ParseArrayPipe({ items: Number })) ids: number[]) {
    return this.paymentService.afterGive(ids)
  }

  @Post()
  create(@Body() body: PaymentInput) {
    return this.paymentService.create(body)
  }

  @Get("action/confirm/:id")
  confirm(@Param("id", ParseIntPipe) id: number) {
    return this.paymentService.confirm(id)
  }

  @Get("action/cancel/:id")
  cancel(@Param("id", ParseIntPipe) id: number) {
    return this.paymentService.cancel(id)
  }
}