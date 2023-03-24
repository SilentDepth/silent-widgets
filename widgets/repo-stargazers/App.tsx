import { type ReactNode } from 'react'
import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client'
import cn from 'classnames'

import css from './App.module.scss'

const client = new ApolloClient({
  uri: '/api/github',
  cache: new InMemoryCache(),
})

const QUERY_REPO_STARGAZER_COUNT = gql`
  query ($owner: String!, $name: String!) {
    repository (owner: $owner, name: $name) {
      stargazerCount
    }
  }
`

type Props = {
  repo: string
  humanize: boolean
}

export default function App (props: Props) {
  const {
    repo,
    humanize = false,
  } = props as Partial<Props>

  if (typeof repo !== 'string' || !repo) {
    const url = new URL(location.href)

    return (
      <Widget>
        <div className="text-sm whitespace-nowrap relative">
          <span className="absolute right-full">{url.origin + url.pathname}?</span>
          <span className="px-0.5">
            <span className="px-0.5 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-[3px]">repo=???</span>
          </span>
        </div>
      </Widget>
    )
  }

  const [owner, name] = repo?.split('/') ?? []
  const { loading, error, data } = import.meta.env.DEV
    ? {
      loading: false,
      error: false,
      data: { repository: { stargazerCount: 2039 } },
    }
    : useQuery(QUERY_REPO_STARGAZER_COUNT, {
      client,
      variables: { owner, name },
    })
  const count = data
    ? humanize ? humanizeNumber(data.repository.stargazerCount) : data.repository.stargazerCount
    : 0

  return (
    <Widget>
      <div className="text-sm leading-none">{owner}</div>
      <div className="mt-0.5 text-sm leading-none font-bold">{name}</div>
      <Badge loading={loading} error={error} value={count} className="mt-1"/>
    </Widget>
  )
}

function Widget ({ children }: { children: ReactNode }) {
  return (
    <div className={cn(css.frame, 'h-screen overflow-hidden grid place-content-center')}>
      <div className="flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

type BadgeProps = {
  loading: boolean
  error: any
  value: number | string
  className?: string
}

function Badge ({ loading, error, value, className }: BadgeProps) {
  return (
    <div className={cn(
      css.badge,
      className,
      'px-2 py-1 rounded-[3px] flex items-center space-x-1',
      loading ? 'loading' : error ? 'error' : null,
    )}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        {loading ? (
          <path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z"/>
        ) : error ? (
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
            className="fill-white"
          />
        ) : (
          <path
            d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
            className="fill-amber-400 dark:fill-amber-600"
          />
        )}
      </svg>
      {loading ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 px-2 fill-current">
          <path d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ) : error ? null : (
        <span className="text-lg leading-none">{value}</span>
      )}
    </div>
  )
}

function humanizeNumber (num: number): string {
  const units = [
    { label: 'B', scale: 1e9 },
    { label: 'M', scale: 1e6 },
    { label: 'K', scale: 1e3 },
    { label: '', scale: 1 },
  ]
  const unit = units.find(it => num >= it.scale)!
  return Math.floor(num / unit.scale) + unit.label
}
