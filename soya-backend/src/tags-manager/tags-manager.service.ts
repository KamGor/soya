import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsManagerService {
  constructor(private prisma: PrismaService) {}

  public createTags(
    tags: {
      name: string;
      configIds?: string[];
    }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const promises: Prisma.Prisma__TagClient<
        {
          name: string;
        },
        never,
        DefaultArgs
      >[] = [];
      for (const tag of tags) {
        const promise = tx.tag.create({
          data: {
            name: tag.name,
            configFields: {
              connect: tag.configIds?.map((configId) => ({ id: configId })),
            },
          },
        });
        promises.push(promise);
      }
      return Promise.all(promises);
    });
  }

  public updateTag(options: { oldName: string; newName: string }) {
    return this.prisma.tag.update({
      where: {
        name: options.oldName,
      },
      data: {
        name: options.newName,
      },
    });
  }

  public deleteTags(tagNames: string[]) {
    return this.prisma.$transaction(async (tx) => {
      const promises: Promise<{
        name: string;
      }>[] = [];
      for (const tagName of tagNames) {
        const promise = tx.tag.delete({
          where: {
            name: tagName,
          },
        });
        promises.push(promise);
      }
      return Promise.all(promises);
    });
  }

  public getTag(tagName: string) {
    return this.prisma.tag.findFirst({
      where: {
        name: tagName,
      },
      include: {
        configFields: true,
      },
    });
  }

  public getTags(
    page?: number | undefined,
    itemsPerPage?: number | undefined,
    search?: string | undefined,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const countPromise = tx.tag.count();
      const tagsPromise = await tx.tag
        .findMany({
          take: itemsPerPage ?? undefined,
          skip: itemsPerPage && page ? itemsPerPage * (page - 1) : undefined,
          include: {
            _count: true,
          },
          where: search
            ? {
                name: {
                  contains: search,
                },
              }
            : undefined,
        })
        .then((response) =>
          response.map((tag) => ({
            name: tag.name,
            count: tag._count.configFields,
          })),
        );
      return {
        count: await countPromise,
        data: await tagsPromise,
      };
    });
  }
}
