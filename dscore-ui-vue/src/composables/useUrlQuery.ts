import { ref, watch, onMounted, type Ref } from 'vue'

export interface UseUrlQueryOptions<T extends Record<string, any>> {
  defaults: T
  prefix?: string
  debounce?: number
}

export function useUrlQuery<T extends Record<string, any>>(
  options: UseUrlQueryOptions<T>
): {
  filters: Ref<T>
  reset: () => void
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void
  getQueryString: () => string
} {
  const { defaults, prefix = '', debounce: debounceMs = 300 } = options

  const filters = ref<T>({ ...defaults }) as Ref<T>

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const serialize = (key: string, value: any): string | null => {
    if (value === null || value === undefined || value === '') return null
    if (Array.isArray(value)) return value.length > 0 ? value.join(',') : null
    if (typeof value === 'boolean') return value ? '1' : '0'
    return String(value)
  }

  const deserialize = (raw: string, defaultValue: any): any => {
    if (typeof defaultValue === 'boolean') return raw === '1' || raw === 'true'
    if (typeof defaultValue === 'number') {
      const num = Number(raw)
      return isNaN(num) ? defaultValue : num
    }
    if (Array.isArray(defaultValue)) return raw ? raw.split(',') : []
    return raw
  }

  const readFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const result = { ...defaults } as Record<string, any>

    for (const key of Object.keys(defaults)) {
      const paramKey = prefix + key
      const raw = params.get(paramKey)
      if (raw !== null) {
        result[key] = deserialize(raw, defaults[key])
      }
    }

    filters.value = result as T
  }

  const writeToUrl = () => {
    const params = new URLSearchParams(window.location.search)

    // Remove old prefixed params
    for (const key of Object.keys(defaults)) {
      params.delete(prefix + key)
    }

    // Set current filter values
    for (const [key, value] of Object.entries(filters.value)) {
      const serialized = serialize(key, value)
      if (serialized !== null) {
        const defaultSerialized = serialize(key, defaults[key])
        // Only write to URL if different from default
        if (serialized !== defaultSerialized) {
          params.set(prefix + key, serialized)
        }
      }
    }

    const qs = params.toString()
    const newUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }

  const reset = () => {
    filters.value = { ...defaults } as T
  }

  const setFilter = <K extends keyof T>(key: K, value: T[K]) => {
    (filters.value as Record<string, any>)[key as string] = value
  }

  const getQueryString = (): string => {
    const parts: string[] = []
    for (const [key, value] of Object.entries(filters.value)) {
      const serialized = serialize(key, value)
      if (serialized !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(serialized)}`)
      }
    }
    return parts.join('&')
  }

  // Watch filters and debounce URL update
  watch(
    filters,
    () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(writeToUrl, debounceMs)
    },
    { deep: true }
  )

  // Read URL on mount
  onMounted(() => {
    readFromUrl()
  })

  return { filters, reset, setFilter, getQueryString }
}
