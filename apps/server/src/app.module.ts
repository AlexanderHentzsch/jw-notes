import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import configuration, {validateConfiguration} from './config/configuration';
import {OpenRouterModule} from './openrouter/openrouter.module';
import {TranscriptionModule} from './transcription/transcription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    OpenRouterModule,
    TranscriptionModule,
  ],
})
export class AppModule {
  constructor() {
    validateConfiguration();
  }
}
