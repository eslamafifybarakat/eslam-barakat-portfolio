// The hero's "Download CV" button is always wired to /{cvFileName} (see
// environment.ts + HeroComponent) even when the PDF itself hasn't been
// supplied — per the brief, the button must never be removed for a missing
// asset, just warned about at build time.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CV_FILENAME = 'Eslam_Afify_Barakat_Senior_Angular_Frontend_Developer_CV.pdf';
const root = path.dirname(fileURLToPath(import.meta.url));
const cvPath = path.join(root, '..', 'public', CV_FILENAME);

if (!existsSync(cvPath)) {
  console.warn(
    `\n⚠ CV asset missing: public/${CV_FILENAME}\n` +
      '  The hero "Download CV" button stays wired to this path regardless — ' +
      'add the real PDF to public/ to make it resolve.\n',
  );
}
