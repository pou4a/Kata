import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateOfferDto) {
    return this.prisma.offer.create({ data: dto });
  }

  findAll() {
    return this.prisma.offer.findMany({ include: { product: true } });
  }

  findOne(id: number) {
    return this.prisma.offer.findUnique({
      where: { id },
      include: { product: true },
    });
  }
}
