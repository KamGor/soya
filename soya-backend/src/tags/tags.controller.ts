import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTagsDTO } from './create-tags.dto';
import { TagsManagerService } from 'src/tags-manager/tags-manager.service';
import { IsPublic } from 'src/authentication/is-public.decorator';
import { UpdateTagDTO } from './update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsManager: TagsManagerService) {}

  @Get()
  public getTags(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('itemsPerPage', new ParseIntPipe({ optional: true }))
    itemsPerPage: number,
    @Query('search') search?: string,
  ) {
    return this.tagsManager.getTags(page, itemsPerPage, search);
  }

  @Get(':tagId')
  public getTag(@Param('tagId') tagId: string) {
    return this.tagsManager.getTag(tagId);
  }

  @Put(':tagId')
  public updateTag(
    @Param('tagId') tagId: string,
    @Body() updateTagDTO: UpdateTagDTO,
  ) {
    return this.tagsManager.updateTag({
      oldName: tagId,
      newName: updateTagDTO.name,
    });
  }

  @Delete(':tagId')
  public deleteTag(@Param('tagId') tagId: string) {
    return this.tagsManager.deleteTags([tagId]);
  }

  @Delete()
  public deleteTags(@Query('ids', ParseArrayPipe) ids: string[]) {
    return this.tagsManager.deleteTags(ids);
  }

  @Post()
  public createTags(@Body() createItemsDTO: CreateTagsDTO) {
    return this.tagsManager.createTags(createItemsDTO.tags);
  }
}
