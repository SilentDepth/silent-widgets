const imports = import.meta.glob<{ default: Record<string, string> }>('./*.json')
const langs = Object.fromEntries(Object.entries(imports).map(([path, loader]) => {
  const lang = path.match(/(\w+-\w+)\.json$/)![1]
  return [lang, () => loader().then(mod => mod.default)]
}))

export default langs
