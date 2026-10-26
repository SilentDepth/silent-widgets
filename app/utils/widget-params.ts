import type {
  ParamResult,
  WidgetParam,
  WidgetParamDefinitions,
  WidgetParams,
  WidgetProps,
  WidgetValue,
} from '@/types/widget'

export function splitColors(raw: string): string[] {
  const colors: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < raw.length; index++) {
    if (raw[index] === '(') depth++
    if (raw[index] === ')') depth--
    if (raw[index] === ',' && depth === 0) {
      colors.push(raw.slice(start, index).trim())
      start = index + 1
    }
  }
  colors.push(raw.slice(start).trim())
  return colors
}

export function parseParam(
  definition: WidgetParam,
  raw: string | undefined,
): ParamResult<WidgetValue> {
  if (raw === undefined) {
    return definition.required && definition.default === ''
      ? { error: `请填写${definition.label}。` }
      : { value: definition.default }
  }
  if (definition.required && !raw.trim()) return { error: `请填写${definition.label}。` }
  if (definition.parse) return definition.parse(raw)

  switch (definition.type) {
    case 'boolean':
      if (raw === '' || raw === 'true') return { value: true }
      if (raw === 'false') return { value: false }
      return { error: '请输入 true 或 false。' }
    case 'integer': {
      if (!/^[+-]?\d+$/.test(raw.trim())) return { error: '请输入整数。' }
      const value = Number(raw)
      if (!Number.isSafeInteger(value)) return { error: '请输入有效整数。' }
      if (definition.options && !definition.options.some(option => option.value === value)) {
        return { error: '请选择列表中的值。' }
      }
      return { value }
    }
    case 'date':
      return raw && Number.isNaN(new Date(raw).getTime())
        ? { error: '请输入有效日期，例如 2026-12-31。' }
        : { value: raw }
    case 'locale':
      return definition.options?.some(option => option.value === raw)
        ? { value: raw }
        : { error: '请选择支持的语言。' }
    case 'color': {
      if (raw === '' && definition.allowEmpty) return { value: '' }
      const colors = splitColors(raw)
      if (!colors[0] || colors.length > (definition.darkVariant ? 2 : 1)) {
        return {
          error: definition.darkVariant
            ? '请输入一种颜色，或用逗号分隔浅色和深色值。'
            : '请输入一种颜色。',
        }
      }
      return { value: colors.filter(Boolean).join(',') }
    }
    case 'text':
      return { value: raw }
  }
}

export function parseWidgetParams<T extends WidgetParamDefinitions>(
  definitions: T,
  raw: URLSearchParams | Record<string, string | undefined>,
) {
  const input = raw instanceof URLSearchParams ? Object.fromEntries(raw) : raw
  const values: Record<string, WidgetValue> = {}
  const errors: Record<string, string> = {}
  for (const [name, definition] of Object.entries(definitions)) {
    const result = parseParam(definition, input[name])
    values[name] = result.error === undefined ? result.value : definition.default
    if (result.error !== undefined) errors[name] = result.error
  }
  return { values: values as WidgetParams<T>, errors }
}

export function serializeParam(definition: WidgetParam, value: WidgetValue): string {
  if (definition.type === 'boolean' && typeof value === 'boolean') {
    return definition.serialize?.(value) ?? String(value)
  }
  if (definition.type === 'integer' && typeof value === 'number') {
    return definition.serialize?.(value) ?? String(value)
  }
  if (definition.type !== 'boolean' && definition.type !== 'integer' && typeof value === 'string') {
    return definition.serialize?.(value) ?? value
  }
  throw new TypeError(`Invalid value for ${definition.label}`)
}

export function serializeWidgetParams(
  definitions: WidgetParamDefinitions,
  values: Record<string, WidgetValue>,
) {
  const query = new URLSearchParams()
  for (const [name, definition] of Object.entries(definitions)) {
    const value = values[name] ?? definition.default
    if (value === definition.default) continue
    query.set(name, serializeParam(definition, value))
  }
  return query
}

export function widgetProps<T extends WidgetParamDefinitions>(definitions: T): WidgetProps<T> {
  return Object.fromEntries(
    Object.entries(definitions).map(([name, definition]) => [
      name,
      {
        type:
          definition.type === 'boolean' ? Boolean : definition.type === 'integer' ? Number : String,
        default: definition.default,
      },
    ]),
  ) as WidgetProps<T>
}
