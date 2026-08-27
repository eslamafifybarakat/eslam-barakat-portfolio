import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ProgressBarComponent } from './shared/ui/progress-bar/progress-bar.component';
import { BackToTopComponent } from './shared/ui/back-to-top/back-to-top.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { IconSpriteComponent } from './shared/ui/icon/icon-sprite.component';
import { PosterSpriteComponent } from './shared/ui/project-poster/poster-sprite.component';
import { TranslatePipe } from './shared/pipes/translate.pipe';
import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/i18n/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ProgressBarComponent,
    BackToTopComponent,
    ToastComponent,
    IconSpriteComponent,
    PosterSpriteComponent,
    TranslatePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Forced early so their constructor effects (data-theme, lang/dir, font
  // preloads) run before the header renders, on both server and client.
  private readonly theme = inject(ThemeService);
  private readonly language = inject(LanguageService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // A brief clip-path wipe on the <main> host when the language flips —
    // purely decorative, so it's skipped entirely by the reduced-motion
    // override in styles/index.scss rather than gated here.
    let previousLang = this.language.lang();
    effect(() => {
      const lang = this.language.lang();
      if (lang !== previousLang) {
        previousLang = lang;
        this.document.body.classList.add('flipping');
        setTimeout(() => this.document.body.classList.remove('flipping'), 620);
      }
    });
  }
}
