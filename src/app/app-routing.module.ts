import { RecipeDetailComponent } from './recipe-list/recipe-detail/recipe-detail.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { NgModule } from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeStartersComponent } from './recipe-starters/recipe-starters.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipes/recipe-resolver.service';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
    {path: '',redirectTo: '/recipes',pathMatch:'full'},
    {path: 'recipes',component: RecipesComponent,children:[
        {path: '',component: RecipeStartersComponent},
        {path: 'new',component: RecipeEditComponent},
        {path: ':id',component: RecipeDetailComponent, resolve: [RecipeResolverService]},
        {path: ':id/edit',component: RecipeEditComponent, resolve: [RecipeResolverService]},
        ]
    },
    {path: 'shopping-list', component: ShoppingListComponent},
    {path: 'auth',component: AuthComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}