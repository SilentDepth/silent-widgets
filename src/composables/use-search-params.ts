export default function useSearchParams (defaults?: Record<string, string>): Record<string, string> {
  const params = Object.fromEntries(new URL(location.href).searchParams.entries())
  return Object.assign({}, defaults, params)
}
