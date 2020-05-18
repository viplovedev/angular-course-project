import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStartersComponent } from './recipe-starters.component';

describe('RecipeStartersComponent', () => {
  let component: RecipeStartersComponent;
  let fixture: ComponentFixture<RecipeStartersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeStartersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeStartersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
