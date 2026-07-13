import {Transform} from 'class-transformer';
import {IsIn, IsNumber, IsString} from 'class-validator';

export class TranscribeBodyDto {
  @Transform(({value}) => Number(value))
  @IsNumber()
  from_second!: number;

  @Transform(({value}) => Number(value))
  @IsNumber()
  to_second!: number;

  @Transform(({value}) => Number(value))
  @IsNumber()
  @IsIn([10, 15, 30])
  window_seconds!: number;

  @IsString()
  note_id!: string;
}
