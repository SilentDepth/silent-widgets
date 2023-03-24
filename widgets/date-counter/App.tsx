import { type CSSProperties, useEffect, useState } from 'react'
import { defu } from 'defu'
import cn from 'classnames'

import useI18n from '~/hooks/useI18n'
import langs from './lang'
import css from './App.module.scss'

const ERR_NO_DATE = Symbol()
const ERR_INVALID_DATE = Symbol()

type Props = {
  date: string
  event: string
  primary: string
  secondary: string
}

export default function App (props: Props) {
  const { t } = useI18n(langs)

  props = defu(props, {
    primary: '#37352f,#ffffffcf',
    secondary: '#37352fb2,#ffffffab',
  })

  // Date

  const date = (() => {
    if (!props.date) return ERR_NO_DATE
    const date = new Date(props.date)
    return Number.isNaN(date.getTime()) ? ERR_INVALID_DATE : date
  })()
  const error = (() => {
    switch (date) {
      case ERR_NO_DATE:
        return t('error.no_date')
      case ERR_INVALID_DATE:
        return t('error.invalid_date')
      default:
        return null
    }
  })()

  const [now, setNow] = useState(import.meta.env.PROD ? new Date() : new Date('2023-03-11'))
  const diff = (() => {
    if (typeof date === 'symbol') return null
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return Math.round((date.getTime() - startOfNow.getTime()) / 864e5)
  })()
  const diffValue = diff == null ? '' : diff === 0 ? t('diff.today') : Math.abs(diff)
  const diffLabel = (() => {
    if (diff == null) return ''
    if (diff > 0) return t('diff.is_future')
    if (diff === 0) return t('diff.is_today')
    if (diff < 0) return t('diff.is_past')
  })()
  const unit = diff === 1 ? t('unit.day') : t('unit.day.plural')

  if (import.meta.env.PROD) {
    useEffect(() => {
      const int = setInterval(() => setNow(new Date()), 6e4)
      return () => clearInterval(int)
    }, [])
  } else {
    // useEffect(() => {
    //   const int = setInterval(() => setNow(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)), 1e3)
    //   return () => clearInterval(int)
    // }, [])
  }

  // Colors

  const primaryColors = props.primary.split(',')
  const secondaryColors = props.secondary.split(',')
  const cssVars = {
    '--primary-color': primaryColors[0],
    '--primary-color-dark': primaryColors[1] || primaryColors[0],
    '--secondary-color': secondaryColors[0],
    '--secondary-color-dark': secondaryColors[1] || secondaryColors[0],
  } as CSSProperties

  return (
    <div className={cn(css.widget, 'h-screen overflow-hidden grid place-content-center place-items-center')} style={cssVars}>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {props.event && (
            <div className="mb-1">
              <span className={cn(css.event, 'font-medium')}>{props.event}</span>
              <span className={cn(css.diff)}>{diffLabel}</span>
            </div>
          )}
          <div className="relative">
            <span className={cn(css.value, 'leading-none text-4xl font-medium')}>{diffValue}</span>
            {Boolean(diff) && (
              <span className={cn(css.unit, 'absolute bottom-0 left-full mb-1 ml-1 block leading-none px-1 py-0.5 text-sm font-medium')}>{unit}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
