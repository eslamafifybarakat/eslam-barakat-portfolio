import { DeferBlockState, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('renders the hero section eagerly', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('section#home')).toBeTruthy();
  });

  it('renders the about section once its viewport-hydration defer block resolves', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const [aboutBlock] = await fixture.getDeferBlocks();
    await aboutBlock.render(DeferBlockState.Complete);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('section#about')).toBeTruthy();
  });
});
