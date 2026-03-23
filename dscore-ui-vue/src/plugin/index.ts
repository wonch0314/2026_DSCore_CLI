import type { App, InjectionKey, Component } from 'vue'
import { inject, reactive } from 'vue'
import type { DsCoreOptions } from '../types'

const DS_CONFIG_KEY: InjectionKey<DsCoreOptions> = Symbol('ds-config')

const defaultConfig: DsCoreOptions = {
  applyDefaultStyle: true,
  defaults: {
    button: { throttle: 0 },
    input: { debounce: 0 },
    modal: { closeOnOverlay: true, closeOnEsc: true },
    pagination: { pageSize: 20 }
  }
}

export function useDsConfig(): DsCoreOptions {
  return inject(DS_CONFIG_KEY, defaultConfig)
}

export const DsCore = {
  install(app: App, options: DsCoreOptions = {}) {
    // applyDefaultStyle이 false가 아니면 스타일 로드
    if (options.applyDefaultStyle !== false) {
      import('../styles/variables.css')
    }

    const config = reactive({
      ...defaultConfig,
      ...options,
      defaults: {
        ...defaultConfig.defaults,
        ...options.defaults
      },
      icons: {
        ...options.icons
      }
    })

    app.provide(DS_CONFIG_KEY, config)
  }
}
