export const state = () => ({
  wallet: {},
  password: {},
  endpoint: "",
})

export const mutations = {
  addWallet (state, wallet, password) {
    state.wallet = wallet;
    state.password = password;
  },
  addEndPoint (state, endpoint) {
    state.endpoint = endpoint;
  },
  remove (state) {
    state.wallet = null;
    state.password = null;
    state.endpoint = "";
  },
}
