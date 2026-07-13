import {HttpException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

interface OpenRouterTranscriptionResponse {
  text?: string;
}

@Injectable()
export class OpenRouterService {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/audio/transcriptions';

  constructor(private readonly configService: ConfigService) {}

  async transcribe(
    file: Express.Multer.File,
    language?: string,
  ): Promise<string> {
    const apiKey = this.configService.getOrThrow<string>('openrouter.apiKey');
    const model = this.configService.get<string>(
      'openrouter.model',
      'openai/whisper-large-v3-turbo',
    );

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype || 'audio/webm',
    });
    formData.append('file', blob, file.originalname || 'segment.webm');
    formData.append('model', model);

    if (language) {
      formData.append('language', language);
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new HttpException(
        `OpenRouter transcription failed: ${errorBody}`,
        response.status,
      );
    }

    const json = (await response.json()) as OpenRouterTranscriptionResponse;
    if (typeof json.text !== 'string') {
      throw new HttpException('Invalid response from OpenRouter', 502);
    }

    return json.text;
  }
}
