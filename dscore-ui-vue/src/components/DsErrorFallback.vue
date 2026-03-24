<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  status?: number
  title?: string
  description?: string
  showRetry?: boolean
  retryText?: string
  icon?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: 0,
  title: '',
  description: '',
  showRetry: true,
  retryText: '다시 시도',
  icon: true,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  retry: []
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const statusDefaults: Record<number, { title: string; description: string }> = {
  400: { title: '잘못된 요청', description: '요청을 처리할 수 없습니다.' },
  403: { title: '접근 권한 없음', description: '이 페이지에 접근할 권한이 없습니다.' },
  404: { title: '페이지를 찾을 수 없음', description: '요청하신 페이지가 존재하지 않습니다.' },
  500: { title: '서버 오류', description: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
}

const fallback = { title: '오류 발생', description: '알 수 없는 오류가 발생했습니다.' }

const displayTitle = computed(() => props.title || statusDefaults[props.status]?.title || fallback.title)
const displayDescription = computed(() => props.description || statusDefaults[props.status]?.description || fallback.description)
</script>

<template>
  <div :class="isStyled && 'ds-error-fallback'">
    <div v-if="icon" :class="isStyled && 'ds-error-fallback__icon'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <span v-if="status" :class="isStyled && 'ds-error-fallback__status'">{{ status }}</span>
    <h3 :class="isStyled && 'ds-error-fallback__title'">{{ displayTitle }}</h3>
    <p :class="isStyled && 'ds-error-fallback__description'">{{ displayDescription }}</p>
    <slot />
    <button
      v-if="showRetry"
      type="button"
      :class="isStyled && 'ds-error-fallback__retry'"
      @click="emit('retry')"
    >
      {{ retryText }}
    </button>
  </div>
</template>

<style>
  .ds-error-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    gap: 0.75rem;
    text-align: center;
    font-family: var(--ds-font-family, inherit);
  }

  .ds-error-fallback__icon {
    color: var(--ds-muted-foreground, #717182);
    margin-bottom: 0.25rem;
  }

  .ds-error-fallback__status {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ds-muted-foreground, #717182);
    line-height: 1;
  }

  .ds-error-fallback__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-error-fallback__description {
    margin: 0;
    font-size: 0.875rem;
    color: var(--ds-muted-foreground, #717182);
    max-width: 24rem;
    line-height: 1.5;
  }

  .ds-error-fallback__retry {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: var(--ds-font-family, inherit);
    color: var(--ds-secondary-foreground, #030213);
    background: var(--ds-secondary, #f0f0f5);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: var(--ds-radius-sm, 6px);
    cursor: pointer;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-error-fallback__retry:hover {
    background: var(--ds-accent, #e9ebef);
  }
</style>
