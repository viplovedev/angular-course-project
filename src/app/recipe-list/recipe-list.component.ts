import {Component,OnInit, OnDestroy} from "@angular/core";
import {Recipe} from '../recipes/recipe.model';
import { RecipeService } from "../recipes/recipe.service";
import { Subscription } from "rxjs";

@Component(
    {
        selector:"recipe-list",
        templateUrl:"./recipe-list.component.html",
        styleUrls:["./recipe-list.component.css"]
    }
)
export class RecipeListComponent implements OnInit,OnDestroy {
    recipes: Recipe[] = [];
    subscription:Subscription;

    constructor(private recipeService:RecipeService){
        this.recipes = this.recipeService.getRecipes();
    }

    ngOnInit(){
        this.subscription = this.recipeService
            .recipesChanged
            .subscribe((recipes: Recipe[]) => {
                this.recipes = recipes;
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}