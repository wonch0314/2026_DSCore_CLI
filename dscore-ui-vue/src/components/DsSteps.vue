<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface StepItem {
  title: string
  description?: string
}

interface Props {
  current: number
  steps: StepItem[]
  direction?: 'horizontal' | 'vertical'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

type StepStatus = 'completed' | 'active' | 'pending'

function getStatus(index: number): StepStatus {
  if (index < props.current) return 'completed'
  if (index === props.current) return 'active'
  return 'pending'
}

const stepStatuses = computed(() =>
  props.steps.map((_, i) => getStatus(i))
)
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-steps',
      isStyled && ('ds-steps--' + direction)
    ]"
  >
    <template v-for="(step, index) in steps" :key="index">
      <div
        :class="[
          isStyled && 'ds-steps__item',
          isStyled && ('ds-steps__item--' + stepStatuses[index])
        ]"
      >
        <div :class="isStyled && 'ds-steps__icon-wrapper'">
          <div :class="isStyled && 'ds-steps__icon'">
            <slot :name="'icon-' + index" :step="step" :status="stepStatuses[index]">
              <svg
                v-if="stepStatuses[index] === 'completed'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                width="14"
                height="14"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span v-else :class="isStyled && 'ds-steps__number'">{{ index + 1 }}</span>
            </slot>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              isStyled && 'ds-steps__connector',
              isStyled && stepStatuses[index] === 'completed' && 'ds-steps__connector--completed'
            ]"
          />
        </div>
        <div :class="isStyled && 'ds-steps__content'">
          <div :class="isStyled && 'ds-steps__title'">
            <slot :name="'title-' + index">{{ step.title }}</slot>
          </div>
          <div v-if="step.description || $slots['description-' + index]" :class="isStyled && 'ds-steps__description'">
            <slot :name="'description-' + index">{{ step.description }}</slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>

  .ds-steps {
    display: flex;
  }

  .ds-steps--horizontal {
    flex-direction: row;
    align-items: flex-start;
  }

  .ds-steps--vertical {
    flex-direction: column;
  }

  .ds-steps__item {
    display: flex;
    flex: 1;
  }

  .ds-steps--horizontal .ds-steps__item {
    flex-direction: column;
    align-items: flex-start;
  }

  .ds-steps--vertical .ds-steps__item {
    flex-direction: row;
    align-items: flex-start;
    flex: none;
  }

  .ds-steps__icon-wrapper {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .ds-steps--horizontal .ds-steps__icon-wrapper {
    flex-direction: row;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .ds-steps--vertical .ds-steps__icon-wrapper {
    flex-direction: column;
    align-items: center;
    margin-right: 0.75rem;
  }

  .ds-steps__icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  .ds-steps__item--completed .ds-steps__icon {
    background: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #fff);
  }

  .ds-steps__item--active .ds-steps__icon {
    background: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #fff);
  }

  .ds-steps__item--pending .ds-steps__icon {
    background: transparent;
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-steps__number {
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
  }

  .ds-steps__connector {
    flex: 1;
    background: var(--ds-border, rgba(0,0,0,0.1));
  }

  .ds-steps--horizontal .ds-steps__connector {
    height: 1px;
    margin: 0 0.5rem;
    align-self: center;
  }

  .ds-steps--vertical .ds-steps__connector {
    width: 1px;
    flex: none;
    height: 1.5rem;
  }

  .ds-steps__connector--completed {
    background: var(--ds-primary, #030213);
  }

  .ds-steps__content {
    padding-bottom: 1rem;
  }

  .ds-steps--horizontal .ds-steps__content {
    padding-bottom: 0;
  }

  .ds-steps__title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ds-foreground, #1a1a1a);
    line-height: 1.4;
  }

  .ds-steps__item--pending .ds-steps__title {
    color: var(--ds-muted-foreground, #717182);
  }

  .ds-steps__description {
    font-size: 0.75rem;
    color: var(--ds-muted-foreground, #717182);
    margin-top: 0.25rem;
    line-height: 1.4;
  }
</style>
