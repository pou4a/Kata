// src/checkout/checkout.module.ts
import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ProductsModule } from '../products/products.module';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [ProductsModule, OffersModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
