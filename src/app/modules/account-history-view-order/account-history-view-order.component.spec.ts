import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHistoryViewOrderComponent } from './account-history-view-order.component';

describe('AccountHistoryViewOrderComponent', () => {
  let component: AccountHistoryViewOrderComponent;
  let fixture: ComponentFixture<AccountHistoryViewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountHistoryViewOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountHistoryViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
