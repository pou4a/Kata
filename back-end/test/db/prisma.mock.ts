export const prismaMock = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  offer: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
} as any;
