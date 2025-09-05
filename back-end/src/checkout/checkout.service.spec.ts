import { CheckoutService } from './checkout.service';
import { prismaMock } from '../../test/db/prisma.mock';

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    service = new CheckoutService(prismaMock as any);
    prismaMock.product.findMany.mockReset();
  });

  it('applies a single offer and charges unit price for the remainder', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Apple',
        price: 30,
        offers: [{ quantity: 2, totalPrice: 45 }],
      },
      { id: 2, name: 'Banana', price: 50, offers: [] },
    ]);

    const quote = await service.calculateQuote([
      { id: 1, quantity: 2 }, // 2 for 45
      { id: 2, quantity: 1 }, // 50
    ]);

    expect(quote.subtotal).toBe(110); // 60 + 50
    expect(quote.total).toBe(95); // 45 + 50
    expect(quote.discount).toBe(15);

    const apple = quote.items.find((i) => i.productId === 1)!;
    expect(apple.composition.offers[0]).toEqual({
      quantity: 2,
      totalPrice: 45,
      count: 1,
    });
    expect(apple.composition.singles).toBe(0);
  });

  it('applies the same offer multiple times with remainder at unit price', async () => {
    // unit 12, offer 4 for 45, qty 10 -> 4+4 + 2 singles = 114
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Orange',
        price: 12,
        offers: [{ quantity: 4, totalPrice: 45 }],
      },
    ]);

    const quote = await service.calculateQuote([{ id: 1, quantity: 10 }]);
    expect(quote.subtotal).toBe(120);
    expect(quote.total).toBe(114);
    expect(quote.discount).toBe(6);

    const item = quote.items[0];
    expect(item.composition.offers[0]).toEqual({
      quantity: 4,
      totalPrice: 45,
      count: 2,
    });
    expect(item.composition.singles).toBe(2);
  });

  it('chooses the one offer with the best per-unit price (no mixing)', async () => {
    // unit 12; offers: 3 for 34 (~11.33), 4 for 45 (11.25) -> choose 4-for-45 only
    // qty 7 -> 4 at offer + 3 singles = 45 + 36 = 81
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Grape',
        price: 12,
        offers: [
          { quantity: 3, totalPrice: 34 },
          { quantity: 4, totalPrice: 45 },
        ],
      },
    ]);

    const quote = await service.calculateQuote([{ id: 1, quantity: 7 }]);
    expect(quote.subtotal).toBe(84);
    expect(quote.total).toBe(81);
    expect(quote.discount).toBe(3);

    const item = quote.items[0];

    expect(item.composition.offers).toEqual([
      { quantity: 4, totalPrice: 45, count: 1 },
    ]);
    expect(item.composition.singles).toBe(3);
  });

  it('falls back to unit price when no offer is applicable (qty smaller than all offers)', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Milk',
        price: 20,
        offers: [{ quantity: 3, totalPrice: 50 }],
      },
    ]);

    const quote = await service.calculateQuote([{ id: 1, quantity: 2 }]); // cannot apply 3-for-50
    expect(quote.subtotal).toBe(40);
    expect(quote.total).toBe(40);
    expect(quote.discount).toBe(0);

    const item = quote.items[0];
    expect(item.composition.offers).toEqual([]);
    expect(item.composition.singles).toBe(2);
  });

  it('ignores unknown products and non-positive quantities', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, name: 'Known', price: 10, offers: [] },
    ]);

    const quote = await service.calculateQuote([
      { id: 999, quantity: 2 }, // unknown -> ignored
      { id: 1, quantity: 0 }, // non-positive -> ignored
      { id: 1, quantity: 3 }, // valid
    ]);

    expect(quote.subtotal).toBe(30);
    expect(quote.total).toBe(30);
    expect(quote.discount).toBe(0);
    expect(quote.items).toHaveLength(1);
  });

  it('calculateTotal returns same grand total as calculateQuote', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Apple',
        price: 30,
        offers: [{ quantity: 2, totalPrice: 45 }],
      },
      { id: 2, name: 'Banana', price: 50, offers: [] },
    ]);

    const items = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ];

    const quote = await service.calculateQuote(items);
    const totalOnly = await service.calculateTotal(items);
    expect(totalOnly).toBe(quote.total);
  });

  it('returns zero for empty carts', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    const quote = await service.calculateQuote([]);
    expect(quote.subtotal).toBe(0);
    expect(quote.total).toBe(0);
    expect(quote.discount).toBe(0);
  });
});
