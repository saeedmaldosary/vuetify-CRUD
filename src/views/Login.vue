<template>
  <v-app style="background-color: #f5f5f5">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <div v-if="errorMsg">
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
                <v-btn :loading="loading" class="mb-3 mr-2" @click="login" color="primary"
                  >Sign in</v-btn
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
  props: {
    source: String,
  },
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
          this.throwErrorMsg("login info wrong!");
        }
        this.loading = false;
      } catch (e) {
        this.throwErrorMsg("error durning login");
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
