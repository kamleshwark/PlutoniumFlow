import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UserService);
  const authToken = userService.getAuthToken();
  
  if(!req.headers.has('Authorization') && authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }
  
  return next(req);
};
