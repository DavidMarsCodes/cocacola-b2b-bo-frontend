import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
