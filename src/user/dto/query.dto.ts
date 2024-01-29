import { PageDto } from 'src/common/dtos/page.dto';

export interface QueryDto extends Partial<PageDto> {
  username?: string;
  roles?: string;
}
