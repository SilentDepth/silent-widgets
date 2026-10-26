import type { PropType } from 'vue'
import type { LocalizedText } from '@/i18n/text'

export type WidgetValue = string | number | boolean
export type ParamResult<T> = { value: T; error?: never } | { error: LocalizedText; value?: never }

interface ParamBase<T> {
  default: T
  label: LocalizedText
  description: LocalizedText
  required?: boolean
  placeholder?: LocalizedText
  parse?: (raw: string) => ParamResult<T>
  serialize?: (value: T) => string
}

interface ParamOption<T> {
  value: T
  label: LocalizedText
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
  name: LocalizedText
  description: LocalizedText
  icon: 'progress' | 'calendar' | 'date' | 'day' | 'star'
  cover: string
}

export interface WidgetConfig {
  params: WidgetParamDefinitions
  meta: WidgetMeta
}
