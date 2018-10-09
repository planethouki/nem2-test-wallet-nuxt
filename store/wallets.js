export const state = () => ({
  list: [],
  selectedCreationDate: ""
})

export const getters = {
  getSelectedWallet (state) {
    let availables = state.list.filter((elm) => { return elm.creationDate === state.selectedCreationDate });
    return availables.length > 0 ? availables[0] : {};
  },
}

export const mutations = {
  addWallet (state, wallet) {
    state.list.push({
      name: wallet.name,
      address: wallet.address.plain(),
      creationDate: wallet.creationDate,
      encryptedPrivateKey: {
        encryptedKey: wallet.encryptedPrivateKey.encryptedKey,
        iv: wallet.encryptedPrivateKey.iv
      },
    })
  },
  setSelectedCreationDate (state, creationDate) {
    state.selectedCreationDate = creationDate;
  },
  removeWalletByPlainAddress (state, address) {
    state.list = state.list.filter((elm) => { return elm.address !== address })
  },
  removeWalletByCreationDate (state, creationDate) {
    state.list = state.list.filter((elm) => { return elm.creationDate !== creationDate })
  },
}
