import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {TranscribeBodyDto} from './dto/transcribe-body.dto';
import {TranscribeQueryDto} from './dto/transcribe-query.dto';
import {TranscriptionService} from './transcription.service';

@Controller('transcribe')
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: {fileSize: 25 * 1024 * 1024},
    }),
  )
  async transcribe(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TranscribeBodyDto,
    @Query() query: TranscribeQueryDto,
  ): Promise<{text: string}> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    const text = await this.transcriptionService.transcribe(
      file,
      body,
      query.language,
    );

    return {text};
  }
}
