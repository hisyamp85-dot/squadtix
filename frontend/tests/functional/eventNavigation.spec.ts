import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AdminEvent from '../../src/views/Admin/Event/AdminEvent.vue'
import DetailEvent from '../../src/views/Admin/Event/DetailEvent.vue'

const routes = [
  { path: '/event', component: AdminEvent, name: 'AdminEvent' },
  { path: '/event/detail/:id', component: DetailEvent, name: 'DetailEvent' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('Event Navigation and Breadcrumb', () => {
  it('navigates from AdminEvent to DetailEvent and displays breadcrumb', async () => {
    router.push('/event')
    await router.isReady()

    const wrapper = mount(AdminEvent, {
      global: {
        plugins: [router],
      },
    })

    // Simulate clicking the eye icon for the first event
    const eyeIcon = wrapper.find('svg') // Assuming EyeIcon is an svg
    await eyeIcon.trigger('click')

    // Wait for navigation
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('DetailEvent')

    // Mount DetailEvent and check breadcrumb text
    const detailWrapper = mount(DetailEvent, {
      global: {
        plugins: [router],
      },
    })

    expect(detailWrapper.html()).toContain('Home')
    expect(detailWrapper.html()).toContain('Event')
    expect(detailWrapper.html()).toContain('Event Detail')
  })
})
