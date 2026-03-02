import DOMPurify from 'dompurify';

export function sanitizeSvg(svgString: string): string {
  if (!svgString) return '';
  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
  });
}
