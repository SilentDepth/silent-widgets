import type { PropType } from 'vue'

export type WidgetValue = string | number | boolean
export type ParamResult<T> = { value: T; error?: never } | { error: string; value?: never }

interface ParamBase<T> {
  default: T
  label: string
  description: string
  required?: boolean
  placeholder?: string
  parse?: (raw: string) => ParamResult<T>
  serialize?: (value: T) => string
}

interface ParamOption<T> {
  value: T
  label: string
}

export type WidgetParam =
  | (ParamBase<string> & {
      type: 'text' | 'date' | 'color' | 'locale'
      options?: readonly ParamOption<string>[]
      darkVariant?: boolean
      allowEmpty?: boolean
    })
  | (ParamBase<number> & { type: 'integer'; options?: readonly ParamOption<number>[] })
  | (ParamBase<boolean> & { type: 'boolean' })

export type WidgetParamDefinitions = Record<string, WidgetParam>
export type InferParam<P extends WidgetParam> = P extends {
  options: readonly { value: infer V extends WidgetValue }[]
}
  ? V
  : P extends { type: 'boolean' }
    ? boolean
    : P extends { type: 'integer' }
      ? number
      : string
export type WidgetParams<T extends WidgetParamDefinitions> = {
  -readonly [K in keyof T]: InferParam<T[K]>
}
export type WidgetProps<T extends WidgetParamDefinitions> = {
  [K in keyof T]: { type: PropType<InferParam<T[K]>>; default: InferParam<T[K]> }
} & {
  noAnimation: { type: BooleanConstructor; default: false }
}

export interface WidgetMeta {
  name: string
  englishName: string
  description: string
  icon: 'progress' | 'calendar' | 'date' | 'day' | 'star'
  title: string
  cover: string
}

export interface WidgetConfig {
  params: WidgetParamDefinitions
  meta: WidgetMeta
}
