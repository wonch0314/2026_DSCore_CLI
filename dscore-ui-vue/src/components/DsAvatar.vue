<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  name: '',
  size: '2.5rem',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const errored = ref(false)

const showImg = computed(() => !!props.src && !errored.value)

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
})

const onError = () => {
  errored.value = true
}
</script>

<template>
  <div :class="isStyled && 'ds-avatar'" :style="{ width: size, height: size }">
    <img
      v-if="showImg"
      :class="isStyled && 'ds-avatar__img'"
      :src="src"
      :alt="alt"
      @error="onError"
    />
    <template v-else>
      <slot name="fallback">
        <span v-if="initials" :class="isStyled && 'ds-avatar__initials'">{{ initials }}</span>
        <svg v-else :class="isStyled && 'ds-avatar__icon'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </slot>
    </template>
  </div>
</template>

<style>
@layer ds-base {
  .ds-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0px;
    background: var(--ds-surface-container, #e8eff3);
    color: var(--ds-on-surface-variant, #5a6970);
    flex-shrink: 0;
  }

  .ds-avatar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ds-avatar__initials {
    font-size: 0.4em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ds-on-surface-variant, #5a6970);
    user-select: none;
  }

  .ds-avatar__icon {
    width: 60%;
    height: 60%;
    color: var(--ds-on-surface-variant, #5a6970);
  }
}
</style>
