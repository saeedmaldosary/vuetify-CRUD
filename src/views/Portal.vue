<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-badge avatar bordered>
            <v-avatar size="40"  rounded>
              <v-img :src="require('@/assets/logo.png')"></v-img>
            </v-avatar>
          </v-badge>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h4 font-weight-bold">Portal</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <template>
          <div v-for="item in items" :key="item.title">
            <v-list-group
              v-if="item.items"
              v-model="item.active"
              :group="'dashboard'"
              class="ml-1"
              :prepend-icon="item.icon"
              no-action
              link
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-icon>
                  <v-icon v-text="subItem.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item class="ml-1" v-else :to="item.to" link>
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon dark @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn dark @click="logout" icon>
        <v-icon dark>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="background-color: #f5f5f5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/dashboard",
        items: [
          {
            title: "Customers",
            icon: "mdi-account-group",
            to: "/dashboard/customers",
          },
        ],
      },
      { title: "About", icon: "mdi-help-box", to: "/about" },
    ],
    right: null,
  }),
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "login" });
    }
    var userObj = JSON.parse(user);
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
