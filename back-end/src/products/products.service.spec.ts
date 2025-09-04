// src/products/products.service.spec.ts
import { ProductsService } from './products.service';
import { prismaMock } from '../../test/db/prisma.mock';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService(prismaMock as any);
  });

  it('should create a product', async () => {
    prismaMock.product.create.mockResolvedValue({
      id: 1,
      name: 'Apple',
      price: 30,
    });

    const result = await service.create({ name: 'Apple', price: 30 });
    expect(result).toEqual({ id: 1, name: 'Apple', price: 30 });
    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: { name: 'Apple', price: 30 },
    });
  });

  it('should return all products with offers', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, name: 'Apple', price: 30, offers: [] },
    ]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Apple');
    expect(prismaMock.product.findMany).toHaveBeenCalled();
  });
});
