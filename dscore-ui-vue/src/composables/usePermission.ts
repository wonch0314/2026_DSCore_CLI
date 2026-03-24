import { ref, type Ref, type App, type Directive } from 'vue'

const currentPermissions = ref<Set<string>>(new Set())
const currentRoles = ref<Set<string>>(new Set())

export function setupPermission(options: {
  permissions?: string[]
  roles?: string[]
}) {
  currentPermissions.value = new Set(options.permissions ?? [])
  currentRoles.value = new Set(options.roles ?? [])
}

export function updatePermissions(permissions: string[], roles?: string[]) {
  currentPermissions.value = new Set(permissions)
  if (roles) currentRoles.value = new Set(roles)
}

export function usePermission() {
  const hasPermission = (permission: string | string[]): boolean => {
    const perms = Array.isArray(permission) ? permission : [permission]
    return perms.some(p => currentPermissions.value.has(p))
  }

  const hasRole = (role: string | string[]): boolean => {
    const roles = Array.isArray(role) ? role : [role]
    return roles.some(r => currentRoles.value.has(r))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => currentPermissions.value.has(p))
  }

  return {
    permissions: currentPermissions as Readonly<Ref<Set<string>>>,
    roles: currentRoles as Readonly<Ref<Set<string>>>,
    hasPermission,
    hasRole,
    hasAllPermissions,
  }
}

function checkPermission(el: HTMLElement, binding: any) {
  const value = binding.value
  const isRole = binding.modifiers?.role
  const isDisable = binding.modifiers?.disable

  const perms = Array.isArray(value) ? value : [value]
  const checker = isRole ? currentRoles : currentPermissions
  const hasAccess = perms.some((p: string) => checker.value.has(p))

  if (!hasAccess) {
    if (isDisable) {
      el.setAttribute('disabled', 'true')
      el.style.opacity = '0.5'
      el.style.pointerEvents = 'none'
    } else {
      el.style.display = 'none'
    }
  } else {
    if (isDisable) {
      el.removeAttribute('disabled')
      el.style.opacity = ''
      el.style.pointerEvents = ''
    } else {
      el.style.display = ''
    }
  }
}

export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  },
}

export const PermissionPlugin = {
  install(app: App) {
    app.directive('permission', vPermission)
  }
}
