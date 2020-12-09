import jwtDecode from 'jwt-decode';
import { USER_ROLES } from "~/plugins/constant.js";

export default async function({ app, redirect }) {
  let userInfo = jwtDecode(app.$keycloak.token);
  if(userInfo.resource_access['kmaa-app'].roles.includes(USER_ROLES.KTC)) {
    redirect('/reports');
  }
}
