import { OffersService } from './offers.service';
import { prismaMock } from '../../test/db/prisma.mock';

describe('OffersService', () => {
  let service: OffersService;

  beforeEach(() => {
    service = new OffersService(prismaMock as any);
  });

  it('should create an offer', async () => {
    prismaMock.offer.create.mockResolvedValue({
      id: 1,
      productId: 1,
      quantity: 2,
      totalPrice: 45,
    });

    const result = await service.create({
      productId: 1,
      quantity: 2,
      totalPrice: 45,
    });
    expect(result).toEqual({
      id: 1,
      productId: 1,
      quantity: 2,
      totalPrice: 45,
    });
    expect(prismaMock.offer.create).toHaveBeenCalledWith({
      data: { productId: 1, quantity: 2, totalPrice: 45 },
    });
  });

  it('should return all offers with products', async () => {
    prismaMock.offer.findMany.mockResolvedValue([
      {
        id: 1,
        productId: 1,
        quantity: 2,
        totalPrice: 45,
        product: { name: 'Apple' },
      },
    ]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].product.name).toBe('Apple');
    expect(prismaMock.offer.findMany).toHaveBeenCalled();
  });
});
