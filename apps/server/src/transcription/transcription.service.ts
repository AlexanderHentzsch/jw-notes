import {Injectable, Logger} from '@nestjs/common';
import {OpenRouterService} from '../openrouter/openrouter.service';
import {TranscribeBodyDto} from './dto/transcribe-body.dto';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(private readonly openRouterService: OpenRouterService) {}

  async transcribe(
    file: Express.Multer.File,
    metadata: TranscribeBodyDto,
    language?: string,
  ): Promise<string> {
    this.logger.log(
      `Transcribing note=${metadata.note_id} ` +
        `window=${metadata.window_seconds}s ` +
        `range=${metadata.from_second}-${metadata.to_second}s` +
        (language ? ` language=${language}` : ''),
    );

    return this.openRouterService.transcribe(file, language);
  }
}
