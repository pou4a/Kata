// src/app.module.ts
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OffersModule } from './offers/offers.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule, OffersModule, CheckoutModule],
})
export class AppModule {}
