<template>
  <v-app style="background-color: #f5f5f5">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card>
              <v-toolbar dark color="primary" style="box-shadow: none">
                <v-list-item style="padding: 0px">
                  <v-list-item-avatar>
                    <v-badge avatar bordered>
                      <v-avatar size="40" rounded>
                        <v-img :src="require('@/assets/logoWhite.png')"></v-img>
                      </v-avatar>
                    </v-badge>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h4 font-weight-bold"
                      >Portal</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-toolbar>
              <v-card-text style="padding: 16px 16px 0px 16px">
                <v-form>
                  <div id="errorMsg" v-if="errorMsg">
                    <v-alert text type="error" color="#d32f2f">
                      {{ errorMsg }}
                    </v-alert>
                  </div>
                  <v-text-field
                    prepend-icon="mdi-account"
                    name="login"
                    label="Email"
                    v-model="email"
                    autocomplete="on"
                    type="email"
                    required
                    hint="username@email.com"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    v-model="password"
                    type="password"
                    autocomplete="on"
                    v-on:keyup.enter="login"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  class="mb-3 mr-2"
                  @click="login"
                  data-test="loginBtn"
                  color="primary"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import utils from "@/mixins/utils.js";
export default {
  mixins: [utils],
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMsg: "",
      successMsg: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.$router.push({ name: "Portal" });
    }
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.email}&password=${this.password}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$router.push({ name: "Portal" });
        } else {
          this.throwErrorMsg("Incorrect email or password.");
        }
        this.loading = false;
      } catch (e) {
        this.throwErrorMsg("Something went wrong. Please try again later.");
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.v-toolbar__content {
  padding: 4px 10px 4px 10px !important;
}
</style>
