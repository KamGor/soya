import { CanActivateFn } from '@angular/router';

export const unauthenticatedGuard: CanActivateFn = (route, state) => {
  return false;
};
