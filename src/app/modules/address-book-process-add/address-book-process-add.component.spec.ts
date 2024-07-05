import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookProcessAddComponent } from './address-book-process.component';

describe('AddressBookProcessAddComponent', () => {
  let component: AddressBookProcessAddComponent;
  let fixture: ComponentFixture<AddressBookProcessAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookProcessAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBookProcessAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
