export default function ({ store, redirect }) {
  if (!store.getters['wallet/existsAccount']) {
    redirect('/login')
  }
}
