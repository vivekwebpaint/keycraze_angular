import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookProcessComponent } from './address-book-process.component';

describe('AddressBookProcessComponent', () => {
  let component: AddressBookProcessComponent;
  let fixture: ComponentFixture<AddressBookProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
