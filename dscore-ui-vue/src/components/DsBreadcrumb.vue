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
  items: () => [],
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

  .ds-breadcrumb__list {
    display: flex;
    align-items: center;
    gap: 0.375rem;
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
    font-size: 0.875rem;
    color: var(--ds-muted-foreground, #717182);
    text-decoration: none;
    transition: color 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .ds-breadcrumb__link:hover {
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-breadcrumb__link--plain {
    cursor: default;
    pointer-events: none;
  }

  .ds-breadcrumb__current {
    font-family: var(--ds-font-family);
    font-size: 0.875rem;
    color: var(--ds-foreground, #1a1a1a);
    font-weight: 500;
  }

  .ds-breadcrumb__separator {
    display: inline-flex;
    align-items: center;
    color: var(--ds-muted-foreground, #717182);
    font-size: 0.875rem;
    user-select: none;
    margin: 0 0.25rem;
  }
</style>
