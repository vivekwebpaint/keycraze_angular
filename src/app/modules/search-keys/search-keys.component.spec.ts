import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKeysComponent } from './search-keys.component';

describe('SearchKeysComponent', () => {
  let component: SearchKeysComponent;
  let fixture: ComponentFixture<SearchKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchKeysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
