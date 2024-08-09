import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConfigManager {
  private eventStream: Subject<{
    type: 'MODIFICATION' | 'DELETION' | 'CREATION' | 'INITATION';
    keys: string[];
    configs: {
      [name: string]: any;
    };
    missingConfigs: string[];
  }>;

  constructor(private prisma: PrismaService) {
    this.eventStream = new Subject();
  }

  public getObservable() {
    return this.eventStream.asObservable();
  }

  public async createConfigFields(
    configFields: {
      name: string;
      value?: any | undefined;
      tagIds?: string[] | undefined;
    }[],
  ) {
    const createdConfigs = await this.prisma.$transaction(async (tx) => {
      const promises: Promise<
        {
          configValues: {
            id: string;
            configFieldId: string;
            value: string;
            createdAt: Date;
          }[];
        } & {
          id: string;
        }
      >[] = [];

      for (const configField of configFields) {
        const promise = tx.configField.create({
          data: {
            id: configField.name,
            configValues: {
              create: {
                value: configField.value,
              },
            },
            tags: configField.tagIds
              ? {
                  connect: configField.tagIds.map((tagId) => ({
                    name: tagId,
                  })),
                }
              : undefined,
          },
          include: {
            configValues: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
        promises.push(promise);
      }

      return Promise.all(promises);
    });

    this.eventStream.next({
      type: 'CREATION',
      keys: createdConfigs.map((config) => config.id),
      configs: createdConfigs.reduce<Record<string, any>>((acc, config) => {
        acc[config.id] = config.configValues[0].value;
        return acc;
      }, {}),
      missingConfigs: [],
    });

    return createdConfigs;
  }

  public async updateConfigField(
    configs: {
      name: string;
      newName?: string;
      value?: any;
      tagIds?: string[] | undefined;
    }[],
  ) {
    const modifiedConfigs = await this.prisma.$transaction(async (tx) => {
      const promises = [];
      for (const config of configs) {
        const promise = tx.configField.update({
          where: {
            id: config.name,
          },
          include: {
            configValues: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          data: {
            tags: {
              set: config.tagIds.map((tagId) => ({ name: tagId })),
            },
            ...(() => ({
              id: config.newName ?? undefined,
            }))(),
            configValues: {
              ...(() => ({
                create: config.value
                  ? {
                      value: config.value,
                    }
                  : undefined,
              }))(),
            },
          },
        });
        promises.push(promise);
      }
      return Promise.all(promises);
    });

    this.eventStream.next({
      type: 'MODIFICATION',
      keys: modifiedConfigs.map((config) => config.id),
      configs: modifiedConfigs.reduce<Record<string, any>>((acc, config) => {
        acc[config.id] = config.configValues[0].value;
        return acc;
      }, {}),
      missingConfigs: [],
    });

    return modifiedConfigs;
  }

  public async deleteConfigFields(configFieldNames: string[]) {
    const deletedConfigs = await this.prisma.$transaction(async (tx) => {
      const promises: Promise<{
        id: string;
      }>[] = [];

      for (const configFieldName of configFieldNames) {
        const promise = tx.configField.delete({
          where: {
            id: configFieldName,
          },
        });

        promises.push(promise);
      }

      return Promise.all(promises);
    });

    this.eventStream.next({
      type: 'DELETION',
      keys: [],
      configs: [],
      missingConfigs: deletedConfigs.map((config) => config.id),
    });

    return deletedConfigs;
  }

  public async getConfigsByName(configFieldNames: string[]) {
    const configs = await this.prisma.configField.findMany({
      where: {
        id: {
          in: configFieldNames,
        },
      },
      include: {
        configValues: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        tags: true,
      },
    });

    let missingConfigs: string[] = [];

    if (configs?.length !== configFieldNames?.length) {
      missingConfigs = configFieldNames.filter(
        (configFieldName) =>
          !configs.some((config) => {
            console.log('config', config.id, configFieldName);
            return config.id === configFieldName;
          }),
      );
    }

    return {
      missingConfigs,
      configs,
    };
  }

  public getConfig(configId: string) {
    return this.prisma.configField.findFirstOrThrow({
      where: {
        id: configId,
      },
    });
  }

  public getConfigs(page: number, itemsPerPage: number, search?: string) {
    return this.prisma.$transaction(async (tx) => {
      const countPromise = tx.configField.count();

      const configs = await tx.configField.findMany({
        take: itemsPerPage ?? undefined,
        skip: itemsPerPage ? itemsPerPage * (page - 1) : undefined,
        where: search
          ? {
              id: {
                contains: search,
              },
            }
          : undefined,
        include: {
          tags: true,
          configValues: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      return {
        count: await countPromise,
        data: configs.map((config) => ({
          id: config.id,
          tags: config.tags,
          value: config?.configValues[0]?.value,
        })),
      };
    });
  }
}
