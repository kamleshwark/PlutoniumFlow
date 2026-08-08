import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { MenuConfigService } from "../services/menu-config.service";

export const routeGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);
    const menuService = inject(MenuConfigService);

    const userRoles = userService.getUserRoles();
    const hastAccess = menuService.hasAccess(route.routeConfig.path, userRoles);
    if(hastAccess)
    {return true;} else {
        router.navigate(['fkmgmt/notFound']);
        return false;
    }

};