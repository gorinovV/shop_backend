import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/createTopPage.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/idvalidation.pipe';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.getById(id);

    if (!topPage) {
      throw new NotFoundException('Нет страницы');
    }

    return topPage;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPageWithAlias = await this.topPageService.getByAlias(alias);

    if (!topPageWithAlias) {
      throw new NotFoundException('Нет страницы');
    }

    return topPageWithAlias;
  }

  @Delete(':id')
  async deleteById(@Param('id', IdValidationPipe) id: string) {
    await this.topPageService.deleteById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    return this.topPageService.updateById(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async findByCategory(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto);
  }

  @Get('searchText/:text')
  async searchText(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}
