import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNewslettersComponent } from './account-newsletters.component';

describe('AccountNewslettersComponent', () => {
  let component: AccountNewslettersComponent;
  let fixture: ComponentFixture<AccountNewslettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountNewslettersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountNewslettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
