const axios = require('axios');
const tokenStore = require('./utils/tokenStore');

class Middleware {
  async bkash_auth(req, res, next) {

     // Clear one
      tokenStore.clearToken("id_token");

    try {
      const { data } = await axios.post(
         'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant',
        {
          app_key: process.env.bkash_api_key,
          app_secret: process.env.bkash_secret_key,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            username: process.env.bkash_username,
            password: process.env.bkash_password,
          },
        }
      );
      req.bkash_token = data.id_token;
      tokenStore.setToken('id_token', data.id_token);
      next();

    } catch (error) {
      console.error("Bkash Auth Error:", error.message);
      
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new Middleware();
