import { type CSSProperties, useEffect, useState } from 'react'
import { defu } from 'defu'
import cn from 'classnames'

import useI18n from '~/hooks/useI18n'
import langs from './lang'
import css from './App.module.scss'

type Props = {
  weekstart: string
  primary: string
  secondary: string
}

export default function App (props: Props) {
  const { t } = useI18n(langs)

  props = defu(props, {
    weekstart: '0',
    primary: '#37352f,#ffffffcf',
    secondary: '#37352f6b,#ffffff47',
  } as Partial<Props>)

  // Date

  const [now, setNow] = useState(import.meta.env.PROD ? new Date() : new Date('2023-03-10'))
  const nowYear = now.getFullYear()
  const nowMonthIdx = now.getMonth()
  const nowMonth = nowMonthIdx + 1
  const nowDate = now.getDate()
  const firstWeekday = new Date(nowYear, nowMonthIdx, 1).getDay()
  const maxDate = new Date(nowYear, nowMonthIdx + 1, 0).getDate()
  const dates = Array.from({ length: maxDate }, (_, idx) => {
    const date = idx + 1
    return {
      date,
      day: (firstWeekday + idx) % 7,
      today: date === nowDate,
    }
  })
  const firstDateColStart = (dates[0].day - Number(props.weekstart) + 7) % 7 + 1

  if (import.meta.env.PROD) {
    useEffect(() => {
      const int = setInterval(() => setNow(new Date()), 6e4)
      return () => clearInterval(int)
    }, [])
  } else {
    // useEffect(() => {
    //   const int = setInterval(() => setNow(now => new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)), 1e3)
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
    <div className={cn(css.root, 'h-screen overflow-hidden grid place-content-center')} style={cssVars}>
      <div className={cn(css.widget, 'grid place-items-center')}>
        <div className={cn(css.month, 'col-span-6 justify-self-start')}>{t(`month.${nowMonth}`)}</div>
        {dates.map(d => (
          <div
            key={d.date}
            className={cn(css.dot, 'aspect-square rounded-full', { [`${css.today} leading-none grid place-content-center`]: d.today }, d.day === 0 || d.day === 6 ? 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]' : 'bg-[var(--primary-color)] dark:bg-[var(--primary-color-dark)]')}
            style={{ gridColumnStart: d.date === 1 ? firstDateColStart : undefined }}
          >
            {d.today && (
              <span className="text-[var(--bg-color)] dark:text-[var(--bg-color-dark)]">{d.date}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
