export default {
  '/': {
    component: 'v-home',
    import: async () => await import('views/v-home'),
  },
  '/about': {
    component: 'v-about',
    import: async () => await import('views/v-about'),
  },
}
