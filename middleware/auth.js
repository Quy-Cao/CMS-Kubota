export default async function({ app }) {
  if(!app.$keycloak.authenticated) {
    return new Promise((resolve, reject) => {
      app.$keycloak.init({ onLoad: 'login-required' })
      .then(resolve)
      .catch(reject);
    })
  }
}
