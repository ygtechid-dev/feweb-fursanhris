export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`)
export const withoutSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
export const withoutPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)
export const ucfirst = (str: string): string => {
  if (!str) return str; // Mengembalikan string kosong jika tidak ada input
  return str.charAt(0).toUpperCase() + str.slice(1);
}
