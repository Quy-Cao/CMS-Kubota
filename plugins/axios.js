export default function ({ $axios, app }) {
  $axios.setHeader('Accept', 'application/json')
  $axios.setHeader('Content-Type', 'application/json; charset=utf-8');
  $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    'post'
  ]);
  $axios.setHeader('Content-Type', 'application/json', [
    'get'
  ]);

  $axios.onRequest(req => {
    /*let auth = null;*/
    let url = req.url;
    url = process.env.baseURLV1 + _.replace(url, '/api/v1/', '');
    req.url = url;
    $axios.setHeader('Authorization', `Bearer ${app.$keycloak.token}`);
    /*try {
      if (req && document.cookie) {
        let cookie = decodeURIComponent(document.cookie);
        auth = JSON.parse(cookie.split("auth=")[1]);
      }
    } catch (err) {
      // TODO
    }

    if(auth) {
      $axios.setHeader('Authorization', `Bearer ${auth.accessToken || null}`);
      $axios.setToken(auth.accessToken || null, 'Bearer');
      $axios.setHeader('token', auth.accessToken || null);
      if(url.indexOf("?") != -1) {
        req.url = `${url}&auth_token=${(auth.accessToken || null)}`;
      } else {
        req.url = `${url}?auth_token=${(auth.accessToken || null)}`;
      }
    }*/

  })

  $axios.onError(error => {
    console.log(error);
    /*
    const code = parseInt(error.response && error.response.status);
    switch(code) {
      case 400:
          redirect('/404');
        break;
      default:
          redirect('/error');
        break;
    }
    */
  })
}