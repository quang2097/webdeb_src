import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelPreviewComponent } from './novel-preview.component';

describe('NovelPreviewComponent', () => {
  let component: NovelPreviewComponent;
  let fixture: ComponentFixture<NovelPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovelPreviewComponent]
    });
    fixture = TestBed.createComponent(NovelPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
