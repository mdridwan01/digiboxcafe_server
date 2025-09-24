// utils/tokenStore.js
let tokenData = {};

module.exports = {
  setToken: (key, value) => {
    tokenData[key] = value;
  },

  getToken: (key) => {
    return tokenData[key];
  },

  clearToken: (key) => {
    if (key) {
      delete tokenData[key];
    } else {
      tokenData = {}; // Clear all
    }
  }
};
