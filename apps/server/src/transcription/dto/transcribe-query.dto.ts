import {IsOptional, Matches} from 'class-validator';

export class TranscribeQueryDto {
  @IsOptional()
  @Matches(/^[a-z]{2}$/, {
    message: 'language must be an ISO-639-1 code (e.g. de, en)',
  })
  language?: string;
}
