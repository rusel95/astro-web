const HTML_TAG_PATTERN = /<[^>]*>/g;

export function sanitizeInput(value: string): string {
  if (!value) return '';
  return value.replace(HTML_TAG_PATTERN, '').trim();
}

export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T
): T {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeInput(
        result[key] as string
      );
    }
  }
  return result;
}
