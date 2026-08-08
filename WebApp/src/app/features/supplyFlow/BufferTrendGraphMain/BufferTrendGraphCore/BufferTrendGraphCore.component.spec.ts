/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BufferTrendGraphCoreComponent } from './BufferTrendGraphCore.component';

describe('BufferTrendGraphCoreComponent', () => {
  let component: BufferTrendGraphCoreComponent;
  let fixture: ComponentFixture<BufferTrendGraphCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferTrendGraphCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferTrendGraphCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
