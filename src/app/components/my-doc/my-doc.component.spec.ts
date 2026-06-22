import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDocComponent } from './my-doc.component';

describe('MyDocComponent', () => {
  let component: MyDocComponent;
  let fixture: ComponentFixture<MyDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyDocComponent]
    });
    fixture = TestBed.createComponent(MyDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
