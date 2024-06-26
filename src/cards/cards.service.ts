import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/CreateCardDto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateCardDto } from "./dto/updateCardDto";

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(dto: CreateCardDto) {
    try {
      return await this.prisma.cards.create({ data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new NotFoundException({
          error: "Column doesn't exist",
        });
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCardsByUserId(userId: number) {
    try {
      return this.prisma.cards.findMany({
        where: { columns: { user_id: userId } },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCardsByColumnId(columnId: number) {
    try {
      return this.prisma.cards.findMany({ where: { column_id: columnId } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateCardById(dto: UpdateCardDto, cardId: number) {
    try {
      return await this.prisma.cards.update({
        where: { id: cardId },
        data: dto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteCardById(cardId: number) {
    try {
      return await this.prisma.cards.delete({ where: { id: cardId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCommentsByCardId(cardId: number) {
    try {
      return (
        await this.prisma.cards.findUnique({
          where: { id: cardId },
          include: { comments: true },
        })
      ).comments;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      } else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
