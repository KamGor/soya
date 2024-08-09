export class CreateConfigDTO {
  configs: ConfigDTO[];
}

export class ConfigDTO {
  name: string;
  value?: string | undefined;
  tagIds?: string[];
}
