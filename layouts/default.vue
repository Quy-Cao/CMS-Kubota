<template>
  <div>
    <a-layout>
      <a-layout-header class="header p-0 position-relative">
        <div class="position-absolute w-100 nav">
          <a-row
            type="flex"
            justify="space-between"
            align="middle"
            class="app-nav px-2 w-100"
          >
            <div class="px-1 line-height-normal">
              <span class="font-22px">
                <strong class="pl-1">Kubota Diagnostics</strong>
              </span>
            </div>
            <div class="px-1 line-height-normal">
              <span class="font-18px mr-1">
                <a-icon type="user" />{{ getUserName($keycloak.token) }}
              </span>
              <span class="mr-1 txt-gray3">{{ getUserRoles($keycloak.token)[0] }}</span>
              <a @click="logout">
                <u>Logout</u>
              </a>
            </div>
          </a-row>
        </div>
      </a-layout-header>
      <a-layout class="wraper">
        <a-layout-sider class="sider">
          <a-menu
            mode="inline"
            theme="dark"
            class="mt-4 bg-black"
            :open-keys="openKeys"
            @openChange="onOpenChange"
            :inlineCollapsed="false"
            :selectable="false"
          >
            <template v-if="!getUserRoles($keycloak.token).includes(USER_ROLES.KTC)">
              <a-sub-menu
                :key="rootSubmenuKeys[0]"
                :class="
                  setMenuActive(URL_MENU.SERIES, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link slot="title" to="/series" class="txt-white font-20px">
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/models.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Models & Flows</span>
                  </div>
                </nuxt-link>
                <a-menu-item
                  key="series-distributors"
                  class="pl-5 sub-item menu-item-height"
                  :class="
                    setMenuActive(URL_MENU.DISTRIBUTORS, path)
                      ? 'ant-menu-item-selected'
                      : ''
                  "
                >
                  <nuxt-link to="/distributors">
                    <span class="ml-2 pl-1">Distributors</span>
                  </nuxt-link>
                </a-menu-item>
                <a-menu-item
                  key="series-issueCategories"
                  class="pl-5 sub-item menu-item-height"
                  :class="
                    setMenuActive(URL_MENU.ISSUECATEGORIES, path)
                      ? 'ant-menu-item-selected'
                      : ''
                  "
                >
                  <nuxt-link to="/issueCategories">
                    <span class="ml-2 pl-1">Issue categories</span>
                  </nuxt-link>
                </a-menu-item>
              </a-sub-menu>
              <a-sub-menu
                :key="rootSubmenuKeys[1]"
                :class="
                  setMenuActive(URL_MENU.CARDS, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link slot="title" to="/cards" class="txt-white font-20px">
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/cards.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Cards</span>
                  </div>
                </nuxt-link>
                <a-menu-item
                  key="cards-cardTypes"
                  class="pl-5 sub-item menu-item-height"
                  :class="
                    setMenuActive(URL_MENU.CARDTYPES, path)
                      ? 'ant-menu-item-selected'
                      : ''
                  "
                >
                  <nuxt-link to="/cardTypes">
                    <span class="ml-2 pl-1">Card Types</span>
                  </nuxt-link>
                </a-menu-item>
              </a-sub-menu>
              <a-sub-menu
                :key="rootSubmenuKeys[2]"
                :class="
                  setMenuActive(URL_MENU.INSTRUCTIONS, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link
                  slot="title"
                  to="/instructions"
                  class="txt-white font-20px"
                >
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/instructions.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Instructions</span>
                  </div>
                </nuxt-link>
              </a-sub-menu>
              <a-sub-menu
                :key="rootSubmenuKeys[3]"
                :class="
                  setMenuActive(URL_MENU.MEDIA, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link
                  slot="title"
                  to="/media/images"
                  class="txt-white font-20px"
                >
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/media.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Media</span>
                  </div>
                </nuxt-link>
              </a-sub-menu>
              <a-sub-menu
                :key="rootSubmenuKeys[4]"
                :class="
                  setMenuActive(URL_MENU.BUTTONS, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link slot="title" to="/buttons" class="txt-white font-20px">
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/buttons.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Buttons</span>
                  </div>
                </nuxt-link>
              </a-sub-menu>
              <a-sub-menu
                :key="rootSubmenuKeys[5]"
                class="mb-3"
                :class="
                  setMenuActive(URL_MENU.LANGUAGES, path)
                    ? 'ant-menu-item-selected'
                    : ''
                "
              >
                <nuxt-link
                  slot="title"
                  to="/languages"
                  class="txt-white font-20px"
                >
                  <div class="d-flex align-item-center sub-menu-item-height">
                    <img
                      src="../assets/images/languages.png"
                      class="icon-menu ml-1 mr-1"
                    />
                    <span>Languages</span>
                  </div>
                </nuxt-link>
              </a-sub-menu>
            </template>
            <a-sub-menu
              :key="rootSubmenuKeys[6]"
              class="mt-4"
              :class="
                setMenuActive(URL_MENU.REPORTS, path)
                  ? 'ant-menu-item-selected'
                  : ''
              "
            >
              <nuxt-link
                slot="title"
                to="/reports"
                class="txt-white font-20px"
              >
                <div class="d-flex align-item-center sub-menu-item-height border-bottom-menu">
                  <img
                    src="../assets/images/reports.png"
                    class="icon-menu ml-1 mr-1"
                  />
                  Reports
                </div>
              </nuxt-link>
            </a-sub-menu>
          </a-menu>
          <a-layout-footer class="bg-white px-4 pt-4 pb-3 txt-right">
            <img src="../assets/images/logo@2x.png" class="img-fluid mb-3" />
            <p class="font-10px pt-1">© 2020 Kubota Corporation</p>
          </a-layout-footer>
        </a-layout-sider>
        <a-layout>
          <a-layout-content class="px-3 py-4">
            <nuxt />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { URL_MENU, SUB_MENU_KEYS, USER_ROLES } from '~/plugins/constant.js';

export default {
  middleware: ['auth', 'languages'],
  data() {
    return {
      path: '',
      URL_MENU,
      rootSubmenuKeys: [...SUB_MENU_KEYS],
      openKeys: [],
      parentKeyOf: {
        issueCategories: SUB_MENU_KEYS[0],
        cardTypes: SUB_MENU_KEYS[1],
        errorCodes: SUB_MENU_KEYS[0],
        issues: SUB_MENU_KEYS[0],
        distributors: SUB_MENU_KEYS[0],
        versions: SUB_MENU_KEYS[0]
      },
      USER_ROLES,
      refreshToken: null,

    };
  },
  watch: {
    $route(to){
      this.path = to.path;
    },
  },
  async created(){
    this.path = this.$route.path;
    let subKey = this.path.split('/')[1];
    this.openKeys = this.parentKeyOf[subKey] ? [this.parentKeyOf[subKey]] : [subKey];
    this.refreshToken = setInterval(() => {
      this.$keycloak.updateToken(35)
      .then(function(refreshed) {
        if (refreshed) {
          console.log('Token was successfully refreshed');
        } else {
          console.log('Token is still valid');
        }
      }).catch(function() {
        window.location.reload();
      });
    }, 270000);
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    logout() {
      this.$keycloak.logout({
				redirectUri: `${window.location.origin}/series`
			});
    },
  },
};
</script>
