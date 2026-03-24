<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: '홈', path: '/' },
  { label: 'Form', path: '/form' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'Data Display', path: '/data-display' },
  { label: 'Navigation', path: '/navigation' },
  { label: 'Overlay', path: '/overlay' },
  { label: 'Advanced Input', path: '/advanced-input' },
  { label: 'BO 데모', path: '/bo-demo' },
  { label: '콘텐츠 관리', path: '/content-management' },
]

const pageTitle = computed(() => {
  const item = navItems.find(n => n.path === route.path)
  return item ? item.label : 'dscore-ui-vue'
})
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__brand-text">dscore</span>
      </div>
      <nav class="sidebar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="sidebar__nav-item"
          :class="{ 'sidebar__nav-item--active': route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </aside>

    <div class="layout__main">
      <header class="layout__header">
        <span class="layout__page-title">{{ pageTitle }}</span>
      </header>
      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--ds-background, #ffffff);
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--ds-card, #ffffff);
  border-right: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.sidebar__brand {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
}

.sidebar__brand-text {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ds-foreground, #1a1a1a);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
}

.sidebar__nav-item {
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ds-muted-foreground, #717182);
  text-decoration: none;
  border-radius: var(--ds-radius-md, 0.375rem);
  transition: color 150ms, background-color 150ms;
}

.sidebar__nav-item:hover {
  color: var(--ds-foreground, #1a1a1a);
  background: var(--ds-accent, #e9ebef);
}

.sidebar__nav-item--active {
  color: var(--ds-foreground, #1a1a1a);
  background: var(--ds-accent, #e9ebef);
  font-weight: 600;
}

.layout__main {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__header {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  background: var(--ds-background, #ffffff);
  border-bottom: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
  position: sticky;
  top: 0;
  z-index: 5;
}

.layout__page-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ds-foreground, #1a1a1a);
}

.layout__content {
  flex: 1;
  padding: 2rem;
  max-width: 1100px;
  width: 100%;
}
</style>
