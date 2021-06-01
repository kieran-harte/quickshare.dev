export default {
  '/': {
    component: 'v-home',
    import: async () => await import('views/v-home'),
  },
  '/code': {
    component: 'v-code',
    import: async () => await import('views/v-code'),
  },
}
