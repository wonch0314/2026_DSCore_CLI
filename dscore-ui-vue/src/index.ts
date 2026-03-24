// Components - Phase 1 Core
export { default as DsSpinner } from './components/DsSpinner.vue'
export { default as DsButton } from './components/DsButton.vue'
export { default as DsInput } from './components/DsInput.vue'
export { default as DsModal } from './components/DsModal.vue'

// Components - Phase 2 Form
export { default as DsTextarea } from './components/DsTextarea.vue'
export { default as DsSelect } from './components/DsSelect.vue'
export { default as DsCheckbox } from './components/DsCheckbox.vue'
export { default as DsRadio } from './components/DsRadio.vue'
export { default as DsRadioGroup } from './components/DsRadioGroup.vue'
export { default as DsSwitch } from './components/DsSwitch.vue'
export { default as DsNumberInput } from './components/DsNumberInput.vue'
export { default as DsFormItem } from './components/DsFormItem.vue'
export { default as DsForm } from './components/DsForm.vue'

// Components - Phase 3 Feedback
export { default as DsToast } from './components/DsToast.vue'
export { default as DsConfirm } from './components/DsConfirm.vue'
export { default as DsAlert } from './components/DsAlert.vue'
export { default as DsProgress } from './components/DsProgress.vue'
export { default as DsSkeleton } from './components/DsSkeleton.vue'

// Components - Phase 4 Data Display
export { default as DsTable } from './components/DsTable.vue'
export { default as DsPagination } from './components/DsPagination.vue'
export { default as DsEmpty } from './components/DsEmpty.vue'
export { default as DsStatusTag } from './components/DsStatusTag.vue'
export { default as DsBadge } from './components/DsBadge.vue'
export { default as DsAvatar } from './components/DsAvatar.vue'
export { default as DsDescription } from './components/DsDescription.vue'
export { default as DsStatCard } from './components/DsStatCard.vue'

// Components - Phase 5 Navigation & Layout
export { default as DsTabs } from './components/DsTabs.vue'
export { default as DsMenuTab } from './components/DsMenuTab.vue'
export { default as DsBreadcrumb } from './components/DsBreadcrumb.vue'
export { default as DsCard } from './components/DsCard.vue'
export { default as DsCollapse } from './components/DsCollapse.vue'
export { default as DsSteps } from './components/DsSteps.vue'
export { default as DsTimeline } from './components/DsTimeline.vue'

// Components - Phase 6 Overlay
export { default as DsDropdown } from './components/DsDropdown.vue'
export { default as DsTooltip } from './components/DsTooltip.vue'
export { default as DsPopover } from './components/DsPopover.vue'
export { default as DsDrawer } from './components/DsDrawer.vue'

// Components - Phase 7 Advanced Inputs
export { default as DsDatePicker } from './components/DsDatePicker.vue'
export { default as DsDateRangePicker } from './components/DsDateRangePicker.vue'
export { default as DsTagInput } from './components/DsTagInput.vue'
export { default as DsFileUpload } from './components/DsFileUpload.vue'
export { default as DsTreeSelect } from './components/DsTreeSelect.vue'
export { default as DsTransfer } from './components/DsTransfer.vue'

// Components - Phase 8 BO Layout
export { default as DsSearchBar } from './components/DsSearchBar.vue'
export { default as DsActionBar } from './components/DsActionBar.vue'

// Components - Phase 9 New Common
export { default as DsErrorFallback } from './components/DsErrorFallback.vue'
export { default as DsFilterChip } from './components/DsFilterChip.vue'

// Plugin
export { DsCore, useDsConfig } from './plugin'

// Types
export * from './types'

// Composables
export { useUrlQuery } from './composables'
export type { UseUrlQueryOptions } from './composables'
export { usePermission, setupPermission, updatePermissions, vPermission, PermissionPlugin } from './composables'
