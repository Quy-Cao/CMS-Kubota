export default async function({ store, app, $axios }) {
  $axios.setHeader('Authorization', `Bearer ${app.$keycloak.token}`);
  const { listLanguage } = store.state.languages;
  if (_.isNull(listLanguage)) {
    await store.dispatch('languages/getListLanguage');
  }
}