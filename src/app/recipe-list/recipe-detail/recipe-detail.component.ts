import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipes/recipe.model';
import { RecipeService } from '../../recipes/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RecipeDetailComponent implements OnInit {

  showDetailFor: Recipe;
  id: number;

  constructor(
    private recipeService:RecipeService,
    private activatedRoute:ActivatedRoute,
    private router:Router) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id=+params['id'];
      this.showDetailFor = this.recipeService.getRecipe(+params['id']);
    })
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.showDetailFor.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo: this.activatedRoute});
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
