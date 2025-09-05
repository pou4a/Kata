import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OfferLite, QuoteItem, QuoteResponse } from './types';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  private priceWithSingleOffer(
    qty: number,
    unitPrice: number,
    offers: OfferLite[] = [],
  ): { total: number; composition: QuoteItem['composition'] } {
    if (qty <= 0) return { total: 0, composition: { offers: [], singles: 0 } };

    const applicable = (offers ?? []).filter(
      (o) => o.quantity > 0 && o.totalPrice > 0 && qty >= o.quantity,
    );

    if (applicable.length === 0) {
      return {
        total: qty * unitPrice,
        composition: { offers: [], singles: qty },
      };
    }

    const selected = applicable.reduce((best, o) => {
      const effBest = best.totalPrice / best.quantity;
      const effO = o.totalPrice / o.quantity;
      if (effO < effBest) return o;
      if (effO === effBest && o.quantity > best.quantity) return o;
      return best;
    });

    const count = Math.floor(qty / selected.quantity);
    const remainder = qty - count * selected.quantity;

    const total = count * selected.totalPrice + remainder * unitPrice;

    return {
      total,
      composition: {
        offers:
          count > 0
            ? [
                {
                  quantity: selected.quantity,
                  totalPrice: selected.totalPrice,
                  count,
                },
              ]
            : [],
        singles: remainder,
      },
    };
  }

  async calculateQuote(
    items: { id: number; quantity: number }[],
  ): Promise<QuoteResponse> {
    if (!items?.length)
      return { items: [], subtotal: 0, discount: 0, total: 0 };

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.id) } },
      include: { offers: true },
    });

    const out: QuoteItem[] = [];

    for (const item of items) {
      if (item.quantity <= 0) continue;

      const product = products.find((p) => p.id === item.id);
      if (!product) continue;

      const unit = product.price;
      const subtotal = unit * item.quantity;

      const { total, composition } = this.priceWithSingleOffer(
        item.quantity,
        unit,
        (product.offers ?? []).map((o) => ({
          quantity: o.quantity,
          totalPrice: o.totalPrice, // euros
        })),
      );

      const discount = Math.max(0, subtotal - total);

      out.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: unit,
        subtotal,
        discount,
        total,
        composition,
      });
    }

    const subtotal = out.reduce((s, i) => s + i.subtotal, 0);
    const total = out.reduce((s, i) => s + i.total, 0);
    const discount = Math.max(0, subtotal - total);

    return { items: out, subtotal, discount, total };
  }

  async calculateTotal(
    items: { id: number; quantity: number }[],
  ): Promise<number> {
    const q = await this.calculateQuote(items);
    return q.total;
  }
}
