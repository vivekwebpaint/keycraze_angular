import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBackInStockNotificationsComponent } from './account-back-in-stock-notifications.component';

describe('AccountBackInStockNotificationsComponent', () => {
  let component: AccountBackInStockNotificationsComponent;
  let fixture: ComponentFixture<AccountBackInStockNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBackInStockNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountBackInStockNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
