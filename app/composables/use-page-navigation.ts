export interface PageNavigation {
  isNavigating: Readonly<Ref<boolean>>
  navigate: (href: string) => void
  replaceUrl: (url: URL) => void
}

export const pageNavigationKey: InjectionKey<PageNavigation> = Symbol('page-navigation')

export function usePageNavigation(): PageNavigation {
  return inject(
    pageNavigationKey,
    () => ({
      isNavigating: ref(false),
      navigate: href => location.assign(href),
      replaceUrl: url => history.replaceState(history.state, '', url),
    }),
    true,
  )
}
