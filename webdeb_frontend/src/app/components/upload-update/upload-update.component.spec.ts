import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUpdateComponent } from './upload-update.component';

describe('UploadUpdateComponent', () => {
  let component: UploadUpdateComponent;
  let fixture: ComponentFixture<UploadUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadUpdateComponent]
    });
    fixture = TestBed.createComponent(UploadUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
