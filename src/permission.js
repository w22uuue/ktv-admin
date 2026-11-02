import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = localStorage.getItem('ktv-token')
  if (to.path === '/login' && token) {
    next('/ktv')
  } else if (to.path !== '/login' && to.path !== '/' && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

router.afterEach(() => NProgress.done())
