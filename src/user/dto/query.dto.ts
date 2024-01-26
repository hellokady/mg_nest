import { PageDto } from 'src/common/dto/page.dto';

export interface QueryDto extends Partial<PageDto> {
  username?: string;
}
