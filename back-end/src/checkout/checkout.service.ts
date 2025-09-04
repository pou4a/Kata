import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async calculateTotal(
    items: { id: number; quantity: number }[],
  ): Promise<number> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.id) } },
      include: { offers: true },
    });

    let total = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) continue;

      const qty = item.quantity;
      const offer = product.offers[0];

      if (offer) {
        const offerCount = Math.floor(qty / offer.quantity);
        const remainder = qty % offer.quantity;

        total += offerCount * offer.totalPrice;
        total += remainder * product.price;
      } else {
        total += qty * product.price;
      }
    }

    return total;
  }
}
