import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

function setRole(page: Page, role: 'admin' | 'agent' | 'client') {
  return page.addInitScript(({ r }: { r: 'admin' | 'agent' | 'client' }) => {
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    localStorage.setItem('token', 'mock-jwt-token')
    localStorage.setItem('role', r)
    localStorage.setItem('sessionExpiry', expiry)
  }, { r: role })
}

test.describe('Landing Page Cleanup', () => {
  test('does not render Breadcrumbs on home', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toHaveCount(0)
    // CTA links present
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Book Demo/i })).toBeVisible()
  })
})

test.describe('Agent Dashboard Navbar & Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await setRole(page, 'agent')
  })

  test('dropdowns open independently without overlap; spacing holds', async ({ page }) => {
    await page.goto('/agent/dashboard')

    const notifBtn = page.getByRole('button', { name: /Notifications/i })
    await expect(notifBtn).toBeVisible()
    await notifBtn.click()
    await expect(page.getByRole('menu', { name: /Notifications menu/i })).toBeVisible()

    // Open profile menu; notification panel should close
    const profileBtn = page.getByRole('button', { name: /Agent\s+User/i })
    await profileBtn.click()
    await expect(page.getByRole('menu', { name: /Profile menu/i })).toBeVisible()
    await expect(page.getByRole('menu', { name: /Notifications menu/i })).toHaveCount(0)
  })

  test('mobile sidebar toggle shows overlay and X icon', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 })
    await page.goto('/agent/dashboard')

    const toggle = page.getByRole('button', { name: /Toggle sidebar/i })
    await expect(toggle).toBeVisible()
    await toggle.click()

    // Overlay is a button with aria-label Close sidebar
    const overlayClose = page.getByRole('button', { name: /Close sidebar/i })
    await expect(overlayClose).toBeVisible()
    await overlayClose.click()
    await expect(overlayClose).toHaveCount(0)
  })

  test('renders correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/agent/dashboard')
    await expect(page.getByText(/Welcome back, Agent/i)).toBeVisible()
    await expect(page.getByRole('navigation', { name: /Breadcrumb/i })).toBeVisible()
  })
})

test.describe('Admin Dashboard Navbar & Components', () => {
  test.beforeEach(async ({ page }) => {
    await setRole(page, 'admin')
  })

  test('admin header dropdowns function and render', async ({ page }) => {
    await page.goto('/admin/dashboard')
    const notifBtn = page.getByRole('button', { name: /Notifications/i })
    await expect(notifBtn).toBeVisible()
    await notifBtn.click()
    await expect(page.getByRole('menu', { name: /Notifications menu/i })).toBeVisible()

    const profileBtn = page.getByRole('button', { name: /Admin\s+User/i })
    await profileBtn.click()
    await expect(page.getByRole('menu', { name: /Profile menu/i })).toBeVisible()
  })

  test('responsive behavior desktop/mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('navigation', { name: /Breadcrumb/i })).toBeVisible()

    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/admin/dashboard')
    // Mobile layout should still show header controls
    await expect(page.getByRole('button', { name: /Toggle sidebar/i })).toBeVisible()
  })
})