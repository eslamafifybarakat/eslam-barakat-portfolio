import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks a string as safe HTML — used only for the small, first-party set of
 * domain-data fields authored with inline `<strong>` emphasis (the About
 * paragraphs, job bullets). These are hardcoded in the data files, not user
 * input, so trusting them outright is correct; never pipe request-derived
 * or user-submitted text through this.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value ?? '');
  }
}
