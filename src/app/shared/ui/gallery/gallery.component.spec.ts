import { TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  async function setup(images: string[]) {
    await TestBed.configureTestingModule({ imports: [GalleryComponent] }).compileComponents();
    const fixture = TestBed.createComponent(GalleryComponent);
    fixture.componentRef.setInput('images', images);
    fixture.componentRef.setInput('alt', 'AGRO TEBA');
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('captionScreenshot', 'Screenshot');
    fixture.componentRef.setInput('captionPoster', 'Vector preview — screenshot pending');
    fixture.detectChanges();
    return fixture;
  }

  it('shows the poster caption with no images', async () => {
    const fixture = await setup([]);
    expect(fixture.nativeElement.querySelector('.gal__cap').textContent).toBe(
      'Vector preview — screenshot pending',
    );
  });

  it('shows the screenshot caption and one thumb per image once probed images are given', async () => {
    const fixture = await setup(['a.webp', 'b.webp']);
    expect(fixture.nativeElement.querySelector('.gal__cap').textContent).toBe('Screenshot');
    expect(fixture.nativeElement.querySelectorAll('.gal__t').length).toBe(2);
  });

  it('steps the index forward on ArrowRight in LTR', async () => {
    const fixture = await setup(['a.webp', 'b.webp']);
    let index: number | undefined;
    fixture.componentInstance.indexChange.subscribe((i: number) => (index = i));

    fixture.nativeElement
      .querySelector('.gal')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(index).toBe(1);
  });
});
