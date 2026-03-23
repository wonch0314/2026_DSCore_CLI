<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface TimelineItem {
  title: string
  description?: string
  time?: string
  type?: string
}

interface Props {
  items: TimelineItem[]
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)
</script>

<template>
  <div :class="isStyled && 'ds-timeline'">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="isStyled && 'ds-timeline__item'"
    >
      <div :class="isStyled && 'ds-timeline__track'">
        <slot :name="'dot-' + index" :item="item">
          <div
            :class="[
              isStyled && 'ds-timeline__dot',
              isStyled && item.type && ('ds-timeline__dot--' + item.type)
            ]"
          />
        </slot>
        <div v-if="index < items.length - 1" :class="isStyled && 'ds-timeline__line'" />
      </div>
      <div :class="isStyled && 'ds-timeline__content'">
        <slot :name="'item-' + index" :item="item">
          <div v-if="item.time" :class="isStyled && 'ds-timeline__time'">{{ item.time }}</div>
          <div :class="isStyled && 'ds-timeline__title'">{{ item.title }}</div>
          <div v-if="item.description" :class="isStyled && 'ds-timeline__description'">{{ item.description }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
@layer ds-base {
  .ds-timeline {
    display: flex;
    flex-direction: column;
    font-family: var(--ds-font-family, 'Inter', sans-serif);
  }

  .ds-timeline__item {
    display: flex;
    gap: var(--ds-spacing-4, 1rem);
    position: relative;
  }

  .ds-timeline__track {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    position: relative;
  }

  .ds-timeline__dot {
    width: 10px;
    height: 10px;
    background: var(--ds-surface-container-highest, #c8d3d7);
    border-radius: 0px;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .ds-timeline__line {
    width: 1px;
    flex: 1;
    min-height: var(--ds-spacing-4, 1rem);
    background: var(--ds-outline-variant, #a9b4b9);
    margin-top: var(--ds-spacing-1, 0.25rem);
    margin-bottom: calc(-1 * var(--ds-spacing-4, 1rem));
  }

  .ds-timeline__content {
    padding-bottom: var(--ds-spacing-6, 1.5rem);
    flex: 1;
    min-width: 0;
  }

  .ds-timeline__item:last-child .ds-timeline__content {
    padding-bottom: 0;
  }

  .ds-timeline__time {
    font-size: var(--ds-font-size-xs, 0.75rem);
    color: var(--ds-on-surface-variant, #8c9ea5);
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    margin-bottom: var(--ds-spacing-1, 0.25rem);
  }

  .ds-timeline__title {
    font-size: var(--ds-font-size-sm, 0.875rem);
    font-weight: 500;
    color: var(--ds-on-surface, #1a1a1a);
    line-height: 1.4;
  }

  .ds-timeline__description {
    font-size: var(--ds-font-size-sm, 0.875rem);
    color: var(--ds-on-surface-variant, #8c9ea5);
    margin-top: var(--ds-spacing-1, 0.25rem);
    line-height: 1.5;
  }
}
</style>
