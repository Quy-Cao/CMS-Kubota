const webpack = require("webpack");

export default {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: ['assets/styles/main.less'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/keycloak.js',
    '@/plugins/antd-ui',
    '@/plugins/axios.js',
    '@/plugins/utils',
    '@/plugins/vue2-editor',
    '@/plugins/moment.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa', [
      'nuxt-i18n',
      {
        lazy: true,
        locales: [{
          code: 'en',
          file: 'en.js'
        },
        {
          code: 'ja',
          file: 'ja.js'
        }
        ],
        defaultLocale: 'en',
        langDir: 'lang/',
        vueI18n: {
          fallbackLocale: 'en'
        }
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // withCredentials: true,
    redirectError: {
      401: '/login',
      404: '/404'
    },
    proxy: true
  },
  /*
  Example:
    this.$axios.$get('/api-v2/coupon/check?code=1&product_id=1');
    this.$axios.$get('/api-v1/users/1');
  */
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    vendor: [
      "lodash",
    ],
    babel: {
      presets({ envName }) {
        return [
          [
            "@nuxt/babel-preset-app",
            {
              targets: { ie: 11 }
            }
          ]
        ]
      }
    },
    transpile: ['vue2-dropzone'],
    plugins: [
      new webpack.ProvidePlugin({
          '_': 'lodash'
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {},
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            "primary-color": "#00a8a9",
            "border-radius-base": "2px",
            "btn-height-base": "40px",
            "btn-font-weight": "bold",
            "btn-font-size-sm": "16px",
            "table-header-bg": "transparent",
            "table-row-hover-bg": "#d4ecee",
            "table-header-color": "#666666",
            "label-color": "#333333",
            "input-bg": "#f5f5f5",
            "input-border-color": "#dedede",
            "btn-default-color": "#00a8a9",
            "btn-default-border": "#00a8a9",
            "input-height-base": "40px",
            "breadcrumb-base-color": "#333333",
            "breadcrumb-last-item-color": "#666666",
            'text-color': '#000000',
            'layout-body-background': '#f5f5f5',
            'layout-sider-background': '#000000',
            'layout-header-background': '#000000',
            'table-row-hover-bg': '#d4ecee',
            'table-padding-vertical': '0',
            'table-padding-horizontal': '0',
            'breadcrumb-separator-margin': '0 0 0 5px',
            'menu-dark-submenu-bg' : '#000',
            'radio-size': '25px',
            'pagination-item-bg-active': '#008486'
          }
        }
      }
    }
  },

  server: {
    port: process.env.NODE_ENV == 'production' ? 2020 : 2024 // default: 3000
  },

  env: {
    image: '',
    domain: process.env.NODE_ENV == 'production' ? 'http://localhost:8008' : 'http://localhost:8009',
    metaTitle: 'Kubota - CMS',
    metaDescription: 'Kubota',
    metaKeywords: 'Kubota',
    stripeKEY: process.env.NODE_ENV == 'production' ? '' : '',
    baseURLV1: process.env.NODE_ENV == 'production' ? 'https://kubota.azurewebsites.net/' : 'https://kmaa-dev.azurewebsites.net/',
  }
};
