export class UpdateConfigDTO {
  configs: ConfigDTO[];
}

class ConfigDTO {
  newName?: string;
  newValue?: string;
}
