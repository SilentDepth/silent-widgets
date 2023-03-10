export default function useSearchParams () {
  return new URL(location.href).searchParams
}
