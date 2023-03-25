import React, { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { ApolloClient, gql, InMemoryCache, type QueryResult, useQuery } from '@apollo/client'
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
  primary: string
  star: string
}

export default function App (props: Props) {
  const {
    repo,
    humanize = false,
    primary,
    star = '#fbbf24,#d97706',
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

  // Core state

  const [owner, name] = repo?.split('/') ?? []
  const { loading, error, data, startPolling: _startPolling, stopPolling, refetch: _refetch } = import.meta.env.DEV
    ? {
      loading: false,
      error: false as any,
      data: { repository: { stargazerCount: 2039 } },
      startPolling: () => {},
      stopPolling: () => {},
      refetch: (() => {}) as any,
    } as Pick<QueryResult, 'loading' | 'error' | 'data' | 'startPolling' | 'stopPolling' | 'refetch'>
    : useQuery(QUERY_REPO_STARGAZER_COUNT, {
      client,
      notifyOnNetworkStatusChange: true,
      variables: { owner, name },
    })
  const count = data
    ? humanize ? humanizeNumber(data.repository.stargazerCount) : data.repository.stargazerCount
    : 0
  const startPolling = () => _startPolling(6e5 /* 10 minutes */)

  if (!import.meta.env.DEV) {
    useEffect(() => {
      startPolling()
      return stopPolling
    }, [])
  }

  async function refetch () {
    stopPolling()
    await _refetch()
    startPolling()
  }

  // Colors

  const primaryColors = primary?.split(',')
  const starColors = star.split(',')
  const cssVars = {
    ...!primaryColors ? {} : {
      '--primary-color': primaryColors[0],
      '--primary-color-dark': primaryColors[1] || primaryColors[0],
    },
    '--star-color': starColors[0],
    '--star-color-dark': starColors[1] || starColors[0],
  } as CSSProperties

  return (
    <Widget style={cssVars}>
      <div className="text-sm leading-none">{owner || '???'}</div>
      <div className="mt-0.5 text-sm leading-none font-bold">{name || '???'}</div>
      <Badge loading={loading} error={error} value={count} refetch={refetch} className="mt-1"/>
    </Widget>
  )
}

function Widget ({ style, children }: { style?: CSSProperties, children: ReactNode }) {
  return (
    <div className={cn(css.frame, 'h-screen overflow-hidden grid place-content-center')} style={style}>
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
  refetch: Function
  className?: string
}

function Badge ({ loading, error, value, refetch: _refetch, className }: BadgeProps) {
  const [showRefetch, setShowRefetch] = useState(false)

  function refetch () {
    setShowRefetch(false)
    _refetch()
  }

  return (
    <div
      className={cn(
        css.badge,
        className,
        'px-2 py-1 rounded-[3px] grid grid-cols-[auto_auto] place-items-center gap-x-1',
        loading ? 'loading' : error ? 'error' : null,
        { 'cursor-pointer': !loading && !error },
      )}
      onMouseEnter={self(() => !loading && !error && setShowRefetch(true))}
      onMouseLeave={self(() => showRefetch && setShowRefetch(false))}
      onClick={ev => showRefetch && refetch()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn('row-start-1 col-start-1 w-5 h-5 fill-current', { 'col-span-full': error }, { 'invisible': showRefetch })}
      >
        {loading ? (
          // ☆
          <path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z"/>
        ) : error ? (
          // ⚠️
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
            className="fill-white"
          />
        ) : (
          // ★
          <path
            d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
            className={css.star}
          />
        )}
      </svg>
      {loading ? (
        // ⋯
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="row-start-1 col-start-2 w-5 h-5 px-2 fill-current">
          <path d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ) : error ? null : (
        <span className={cn('row-start-1 col-start-2 text-lg leading-none', { 'invisible': showRefetch })}>{value}</span>
      )}
      {showRefetch && (
        // 🔄
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="row-span-full col-span-full w-5 h-5 fill-current">
          <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"/>
        </svg>
      )}
    </div>
  )
}

function self (cb: Function) {
  return (ev: React.UIEvent) => {
    ev.target === ev.currentTarget && cb(ev)
  }
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
