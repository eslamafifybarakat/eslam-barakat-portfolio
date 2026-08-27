import { TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('renders a styled 404 with a way back home and to work', async () => {
    await TestBed.configureTestingModule({ imports: [NotFoundComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.not-found__code')?.textContent).toBe('404');
    expect(el.querySelectorAll('a.btn').length).toBe(2);
  });
});
