import { type CSSProperties, useEffect, useState } from 'react'
import { defu } from 'defu'
import cn from 'classnames'

import css from './App.module.scss'

type Props = {
  sun: string
}

export default function App (props: Props) {
  props = defu(props, {
    sun: '#f59e0b',
  })

  // Time

  const [now, setNow] = useState(import.meta.env.PROD ? new Date() : new Date('2023-03-12 09:00:00'))

  if (import.meta.env.PROD) {
    useEffect(() => {
      const int = setInterval(() => setNow(new Date()), 6e4)
      return () => clearInterval(int)
    }, [])
  } else {
    // useEffect(() => {
    //   const int = setInterval(() => setNow(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate(), prev.getHours(), prev.getMinutes() + 10)), 1e3)
    //   return () => clearInterval(int)
    // }, [])
  }

  const angle = (() => {
    const nowYear = now.getFullYear()
    const nowMonthIdx = now.getMonth()
    const nowDate = now.getDate()
    const startOfToday = new Date(nowYear, nowMonthIdx, nowDate).getTime()
    const startOfTomorrow = new Date(nowYear, nowMonthIdx, nowDate + 1).getTime()
    return (now.getTime() - startOfToday) / (startOfTomorrow - startOfToday) * 360
  })()

  // Colors

  const cssVars = {
    '--sun-color': props.sun,
  } as CSSProperties

  return (
    <div className={cn(css.widget, 'h-screen overflow-hidden grid place-content-center')} style={cssVars}>
      <div className={cn(css.orbit, 'relative flex flex-col')}>
        <div className={cn(css.day, 'flex-1 border-2 border-b-0 border-solid rounded-t-full')}></div>
        <div className={cn(css.night, 'flex-1 border-2 border-t-0 border-solid rounded-b-full')}></div>
        <div
          className="absolute bottom-0 inset-x-0 mx-auto w-0 h-1/2 origin-top flex flex-col justify-end items-center"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className={cn(css.sun, 'rounded-full translate-y-1/2')}></div>
        </div>
      </div>
    </div>
  )
}
