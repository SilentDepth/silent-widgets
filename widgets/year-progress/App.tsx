import { useState, useEffect, type CSSProperties } from 'react'

import useI18n from '~/hooks/useI18n'
import langs from './lang'

const MONTH_DAYS = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

type Props = {
  primary: string
  secondary: string
}

export default function App ({
  primary = '#37352f,#ffffffcf',
  secondary = '#37352f29,#ffffff21',
}: Props) {
  const { t } = useI18n(langs)

  // Date

  const [now, setNow] = useState(new Date())
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth() + 1
  const nowDate = now.getDate()
  const nowWeekday = now.getDay()
  const months = (() => {
    const febDays = new Date(now.getFullYear(), 2, 0).getDate()
    return Array.from({ length: 12 }, (_, idx) => ({
      num: idx + 1,
      days: idx === 1 ? febDays : MONTH_DAYS[idx],
    }))
  })()

  if (import.meta.env.PROD) {
    useEffect(() => {
      const int = setInterval(() => setNow(new Date()), 6e4)
      return () => clearInterval(int)
    }, [])
  }

  // Colors

  const primaryColors = primary.split(',')
  const secondaryColors = secondary.split(',')
  const cssVars = {
    '--primary-color': primaryColors[0],
    '--primary-color-dark': primaryColors[1] || primaryColors[0],
    '--secondary-color': secondaryColors[0],
    '--secondary-color-dark': secondaryColors[1] || secondaryColors[0],
  } as CSSProperties

  return (
    <div
      className="h-screen overflow-hidden text-[var(--primary-color)] dark:text-[var(--primary-color-dark)] text-xs leading-none whitespace-nowrap flex items-center space-x-0.5"
      style={cssVars}
    >
      {months.map(m => (
        <div
          key={m.num}
          className={`h-1 relative ${m.num < nowMonth ? 'bg-[currentColor]' : 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]'}`}
          style={{ flex: `${m.days} ${m.days} 0` }}
        >
          {m.num === nowMonth && (
            <>
              <span className="absolute left-0 bottom-full flex flex-col space-y-0.5 mb-1">
                <span>{nowYear}</span>
                <strong>{t(`month.${m.num}`)}</strong>
              </span>
              <div className="relative h-full bg-[currentColor]" style={{ width: nowDate / m.days * 100 + '%' }}>
                <span className="absolute left-0 top-full w-full text-right flex flex-col space-y-0.5 mt-1">
                  <strong>{nowDate}</strong>
                  <span>{t(`weekday.${nowWeekday}`)}</span>
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
