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
  background: var(--ds-surface, #f7f9fb);
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: var(--ds-surface-container-low, #eef1f3);
  border-right: 1px solid var(--ds-outline-variant, #dde3e7);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.sidebar__brand {
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid var(--ds-outline-variant, #dde3e7);
}

.sidebar__brand-text {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ds-on-surface-variant, #6b7b82);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar__nav-item {
  display: block;
  padding: 0.5rem 1.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ds-on-surface-variant, #6b7b82);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s, background-color 0.15s;
}

.sidebar__nav-item:hover {
  color: var(--ds-on-surface, #2a3439);
  background: var(--ds-surface-container, #e4e9ec);
}

.sidebar__nav-item--active {
  color: var(--ds-primary, #1a6b8a);
  border-left-color: var(--ds-primary, #1a6b8a);
  background: var(--ds-surface-container, #e4e9ec);
  font-weight: 600;
}

.layout__main {
  flex: 1;
  margin-left: 200px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__header {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  background: var(--ds-surface, #f7f9fb);
  border-bottom: 1px solid var(--ds-outline-variant, #dde3e7);
  position: sticky;
  top: 0;
  z-index: 5;
}

.layout__page-title {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ds-on-surface-variant, #6b7b82);
}

.layout__content {
  flex: 1;
  padding: 2.5rem 2rem;
  max-width: 1100px;
  width: 100%;
}
</style>
