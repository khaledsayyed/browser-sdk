import { clearAllCookies } from './specHelper'

beforeEach(() => {
  ;(navigator.sendBeacon as any) = false
  // reset globals
  ;(window as any).DD_LOGS = {}
  ;(window as any).DD_RUM = {}
  // prevent 'Some of your tests did a full page reload!' issue
  window.onbeforeunload = () => 'stop'
})

afterEach(() => {
  clearAllCookies()
})
