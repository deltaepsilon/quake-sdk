module.exports = {
  getQuakeCookies: function getQuakeCookies (res) {
    if (res.headers['set-cookie']) {
      return res.headers['set-cookie'].pop().split(';')[0];
    } else {
      return res.headers.cookie;
    }

  }
}
