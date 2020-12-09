import Keycloak from 'keycloak-js';

export default (_, inject) => {
  let keycloak = new Keycloak({
    url: 'https://kmaakc.eastus.cloudapp.azure.com/auth/',
    realm: 'KMAA',
    clientId: 'kmaa-app'
  });
  inject('keycloak', keycloak);
}
