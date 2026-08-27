import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  it('renders nothing when closed, and closes on Escape when open', async () => {
    await TestBed.configureTestingModule({ imports: [ModalComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('closeLabel', 'Close');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal')).toBeNull();

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal.is-open')).toBeTruthy();

    let closed = false;
    fixture.componentInstance.openChange.subscribe((v: boolean) => (closed = v === false));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBe(true);
  });
});
