export default function authHeader() {
    l let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }