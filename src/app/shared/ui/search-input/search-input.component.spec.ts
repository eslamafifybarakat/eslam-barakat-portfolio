import { TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  it('emits valueChange on input and exposes focus()', async () => {
    await TestBed.configureTestingModule({ imports: [SearchInputComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SearchInputComponent);
    fixture.componentRef.setInput('placeholder', 'Search projects or tech…');
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.valueChange.subscribe((v: string) => (emitted = v));

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'agora';
    input.dispatchEvent(new Event('input'));
    expect(emitted).toBe('agora');

    fixture.componentInstance.focus();
    expect(document.activeElement).toBe(input);
  });
});
