import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService:AuthService,
        private router:Router
    ){

    }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): 
        boolean | 
        UrlTree |
        Observable<boolean | UrlTree> | 
        Promise<boolean | UrlTree> {
        return this.authService.user.pipe(map(user => {
            const isUserActivated =  !!user;

            if(isUserActivated){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }))
    }

}