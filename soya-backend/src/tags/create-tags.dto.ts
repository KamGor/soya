export class CreateTagsDTO {
  tags: TagDTO[];
}

class TagDTO {
  name: string;
  configIds?: string[];
}
