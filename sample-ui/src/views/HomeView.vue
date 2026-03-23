<script setup lang="ts">
import { DsCard } from 'dscore-ui-vue'

const categories = [
  { name: 'Form', path: '/form', count: 9, desc: 'Button, Input, Textarea, Select, Checkbox, Radio, Switch, NumberInput, Form' },
  { name: 'Feedback', path: '/feedback', count: 5, desc: 'Toast, Confirm, Alert, Progress, Skeleton' },
  { name: 'Data Display', path: '/data-display', count: 8, desc: 'Table, Pagination, Empty, StatusTag, Badge, Avatar, Description, StatCard' },
  { name: 'Navigation & Layout', path: '/navigation', count: 7, desc: 'Tabs, MenuTab, Breadcrumb, Card, Collapse, Steps, Timeline' },
  { name: 'Overlay', path: '/overlay', count: 4, desc: 'Dropdown, Tooltip, Popover, Drawer' },
  { name: 'Advanced Input', path: '/advanced-input', count: 6, desc: 'DatePicker, DateRangePicker, TagInput, FileUpload, TreeSelect, Transfer' },
  { name: 'BO 데모', path: '/bo-demo', count: 0, desc: '실제 백오피스 페이지를 시뮬레이션한 통합 데모' },
]
</script>

<template>
  <div>
    <div class="demo-section">
      <h1 class="demo-section__title" style="font-size: 2.5rem;">dscore-ui-vue</h1>
      <p class="demo-section__subtitle" style="font-size: 1rem;">Vue 3 UI Components — The Architectural Minimalist</p>
    </div>

    <div class="demo-grid">
      <router-link v-for="cat in categories" :key="cat.path" :to="cat.path" style="text-decoration: none;">
        <DsCard>
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600;">{{ cat.name }}</span>
              <span v-if="cat.count" class="demo-value" style="margin: 0;">{{ cat.count }} components</span>
            </div>
          </template>
          <p style="font-size: 0.875rem; color: var(--ds-on-surface-variant);">{{ cat.desc }}</p>
        </DsCard>
      </router-link>
    </div>
  </div>
</template>
