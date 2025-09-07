import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { QuoteResponse } from './types';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  checkout(
    @Body() body: { items: { id: number; quantity: number }[] },
  ): Promise<QuoteResponse> {
    return this.checkoutService.calculateQuote(body.items);
  }
}
