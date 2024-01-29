import { SetMetadata } from '@nestjs/common';

export const META_DATA_KEYS = Object.freeze({
  RequireLogin: Symbol('RequireLogin'),
  RequirePermission: Symbol('RequirePermission'),
});

export const RequireLogin = () =>
  SetMetadata(META_DATA_KEYS.RequireLogin, true);

export const RequirePermission = (perimssions: string[]) =>
  SetMetadata(META_DATA_KEYS.RequirePermission, perimssions);
