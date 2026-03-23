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

  .ds-timeline {
    display: flex;
    flex-direction: column;
  }

  .ds-timeline__item {
    display: flex;
    gap: 1rem;
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
    background: var(--ds-muted-foreground, #717182);
    border-radius: 9999px;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .ds-timeline__dot--success {
    background: var(--ds-success, #16a34a);
  }

  .ds-timeline__dot--error {
    background: var(--ds-error, #d93025);
  }

  .ds-timeline__dot--warning {
    background: var(--ds-warning, #f59e0b);
  }

  .ds-timeline__dot--info {
    background: var(--ds-info, #2563eb);
  }

  .ds-timeline__line {
    width: 1px;
    flex: 1;
    min-height: 1rem;
    background: var(--ds-border, rgba(0,0,0,0.1));
    margin-top: 0.25rem;
    margin-bottom: -1rem;
  }

  .ds-timeline__content {
    padding-bottom: 1.5rem;
    flex: 1;
    min-width: 0;
  }

  .ds-timeline__item:last-child .ds-timeline__content {
    padding-bottom: 0;
  }

  .ds-timeline__time {
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 0.25rem;
  }

  .ds-timeline__title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
    line-height: 1.4;
  }

  .ds-timeline__description {
    font-size: 0.875rem;
    color: var(--ds-muted-foreground, #717182);
    margin-top: 0.25rem;
    line-height: 1.5;
  }
</style>
