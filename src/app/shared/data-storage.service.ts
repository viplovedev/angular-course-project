import { AuthService } from './../auth/auth.service';
import { Ingredient } from './ingredient.model';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Recipe } from "../recipes/recipe.model";
import { map, tap, exhaustMap, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http:HttpClient,
                private recipeService:RecipeService,
                private authService:AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(
            'https://ng-course-recipe-book-a3a7b.firebaseio.com/recipes.json',
            recipes
        ).subscribe(response => {
            console.log(response);
        })
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
            'https://ng-course-recipe-book-a3a7b.firebaseio.com/recipes.json'
        )
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ... recipe, 
                        ingredients: recipe.ingredients?recipe.ingredients:[]
                }})
            })
            ,tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }
        
}