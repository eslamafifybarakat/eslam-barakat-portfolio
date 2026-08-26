import { TestBed } from '@angular/core/testing';
import { SpecListComponent } from './spec-list.component';

describe('SpecListComponent', () => {
  it('renders one dt/dd pair per item', async () => {
    await TestBed.configureTestingModule({ imports: [SpecListComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SpecListComponent);
    fixture.componentRef.setInput('items', [
      { label: 'Role', value: 'Senior Angular Frontend Developer' },
      { label: 'Base', value: 'Cairo, Egypt · remote' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('dt').length).toBe(2);
    expect(fixture.nativeElement.querySelector('dd').textContent).toBe('Senior Angular Frontend Developer');
  });
});
