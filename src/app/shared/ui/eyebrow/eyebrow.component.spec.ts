import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { EyebrowComponent } from './eyebrow.component';

@Component({
  standalone: true,
  imports: [EyebrowComponent],
  template: `<app-eyebrow>Summary</app-eyebrow>`,
})
class HostComponent {}

describe('EyebrowComponent', () => {
  it('projects its content inside a p.eyebrow', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p.eyebrow').textContent).toBe('Summary');
  });
});
