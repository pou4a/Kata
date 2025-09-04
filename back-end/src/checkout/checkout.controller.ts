import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async calculate(@Body() body: { items: { id: number; quantity: number }[] }) {
    const total = await this.checkoutService.calculateTotal(body.items);
    return { total };
  }
}
