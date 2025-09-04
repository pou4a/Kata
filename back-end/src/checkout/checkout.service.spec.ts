import { CheckoutService } from './checkout.service';
import { prismaMock } from '../../test/db/prisma.mock';

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    service = new CheckoutService(prismaMock as any);
  });

  it('should calculate total with offers', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Apple',
        price: 30,
        offers: [{ quantity: 2, totalPrice: 45 }],
      },
      { id: 2, name: 'Banana', price: 50, offers: [] },
    ]);

    const result = await service.calculateTotal([
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ]);

    expect(result).toBe(95); // 45 + 50
    expect(prismaMock.product.findMany).toHaveBeenCalled();
  });
});
