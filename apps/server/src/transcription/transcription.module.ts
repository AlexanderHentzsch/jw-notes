import {Module} from '@nestjs/common';
import {OpenRouterModule} from '../openrouter/openrouter.module';
import {TranscriptionController} from './transcription.controller';
import {TranscriptionService} from './transcription.service';

@Module({
  imports: [OpenRouterModule],
  controllers: [TranscriptionController],
  providers: [TranscriptionService],
})
export class TranscriptionModule {}
