import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  it('shows a message, then auto-dismisses after ~2.2s', () => {
    vi.useFakeTimers();
    const service = TestBed.inject(ToastService);

    service.show('Email copied');
    expect(service.message()).toBe('Email copied');

    vi.advanceTimersByTime(2199);
    expect(service.message()).toBe('Email copied');

    vi.advanceTimersByTime(2);
    expect(service.message()).toBeNull();

    vi.useRealTimers();
  });
});
