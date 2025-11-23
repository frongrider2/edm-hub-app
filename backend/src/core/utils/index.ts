export function slugify(str: string): string {
  return str
    .toString()
    .normalize('NFKD') // Normalize to decompose accents
    .replace(/[\u0300-\u036F]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}
