<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Item {
  label: string
  value: string | number
  span?: number
}

interface Props {
  items?: Item[]
  columns?: number
  layout?: 'horizontal' | 'vertical'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: 2,
  layout: 'horizontal',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

defineSlots<{
  [key: `item-${number}`]: (props: { item: Item }) => any
}>()
</script>

<template>
  <dl
    :class="[isStyled && 'ds-description', isStyled && 'ds-description--' + layout]"
    :style="{ gridTemplateColumns: 'repeat(' + columns + ', 1fr)' }"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="isStyled && 'ds-description__item'"
      :style="{ gridColumn: 'span ' + (item.span || 1) }"
    >
      <dt :class="isStyled && 'ds-description__label'">{{ item.label }}</dt>
      <dd :class="isStyled && 'ds-description__value'">
        <slot :name="`item-${index}`" :item="item">{{ item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>

<style>

  .ds-description {
    display: grid;
    gap: 1rem;
    margin: 0;
  }

  .ds-description__item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ds-description--horizontal .ds-description__item {
    flex-direction: row;
    align-items: baseline;
    gap: 0.75rem;
  }

  .ds-description__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ds-muted-foreground, #717182);
    white-space: nowrap;
  }

  .ds-description--horizontal .ds-description__label {
    min-width: 8rem;
  }

  .ds-description__value {
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
    margin: 0;
  }
</style>
