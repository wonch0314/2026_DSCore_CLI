<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface BreadcrumbItem {
  label: string
  to?: string | object
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  separator: '/',
  applyDefaultStyle: undefined
})

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

function isLast(index: number) {
  return index === props.items.length - 1
}

function hasRouterLink(item: BreadcrumbItem) {
  return item.to !== undefined
}
</script>

<template>
  <nav :class="isStyled && 'ds-breadcrumb'" aria-label="Breadcrumb">
    <ol :class="isStyled && 'ds-breadcrumb__list'">
      <template v-for="(item, index) in items" :key="index">
        <li :class="isStyled && 'ds-breadcrumb__item'">
          <span v-if="isLast(index)" :class="isStyled && 'ds-breadcrumb__current'" aria-current="page">
            <slot :name="`item-${index}`">{{ item.label }}</slot>
          </span>
          <router-link
            v-else-if="hasRouterLink(item)"
            :class="isStyled && 'ds-breadcrumb__link'"
            :to="item.to!"
          >
            <slot :name="`item-${index}`">{{ item.label }}</slot>
          </router-link>
          <a
            v-else-if="item.href"
            :class="isStyled && 'ds-breadcrumb__link'"
            :href="item.href"
          >
            <slot :name="`item-${index}`">{{ item.label }}</slot>
          </a>
          <span v-else :class="[isStyled && 'ds-breadcrumb__link', isStyled && 'ds-breadcrumb__link--plain']">
            <slot :name="`item-${index}`">{{ item.label }}</slot>
          </span>
        </li>

        <li
          v-if="!isLast(index)"
          :class="isStyled && 'ds-breadcrumb__separator'"
          aria-hidden="true"
        >
          <slot name="separator">{{ separator }}</slot>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style>
@layer ds-base {
  .ds-breadcrumb__list {
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-2, 0.5rem);
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
  }

  .ds-breadcrumb__item {
    display: inline-flex;
    align-items: center;
  }

  .ds-breadcrumb__link {
    font-family: var(--ds-font-family);
    font-size: var(--ds-font-size-sm, 0.75rem);
    color: var(--ds-on-surface-variant, #6b7b82);
    text-decoration: none;
    transition: color var(--ds-transition-fast, 150ms ease);
  }

  .ds-breadcrumb__link:hover {
    color: var(--ds-on-surface, #2a3439);
  }

  .ds-breadcrumb__link--plain {
    cursor: default;
  }

  .ds-breadcrumb__current {
    font-family: var(--ds-font-family);
    font-size: var(--ds-font-size-sm, 0.75rem);
    color: var(--ds-on-surface, #2a3439);
    font-weight: 500;
  }

  .ds-breadcrumb__separator {
    display: inline-flex;
    align-items: center;
    color: var(--ds-on-surface-variant, #6b7b82);
    font-size: var(--ds-font-size-sm, 0.75rem);
    user-select: none;
  }
}
</style>
