<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card class="dialog">
      <div class="cardMain">
        <h3 class="mb-2">Session Expire Warning</h3>
        <div>
          <p>Your session will expire in 2 minutes. Do you want to extend?</p>
        </div>
      </div>
      <v-card-actions style="padding: 0">
        <div style="width: 100%">
          <div style="display: flex; justify-content: flex-end">
            <v-btn
              color="primary"
              class="mr-2"
              @click="extendSession"
              style="color: #fafafa"
              >Extend</v-btn
            >
            <v-btn color="#BDBDBD" @click="close" style="color: #fafafa"
              >Cancel</v-btn
            >
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      warningTimer: null,
      logoutTimer: null,
    };
  },
  watch: {
    $route() {
      this.resetTimer("reset");
    },
  },
  mounted() {
    this.resetTimer("reset");
  },
  destroyed() {
    this.resetTimer();
  },
  methods: {
    showDialog() {
      this.dialog = true;
    },
    autoLogout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
    setTimer() {
      this.warningTimer = setTimeout(this.showDialog, 2 * 60 * 1000);
      this.logoutTimer = setTimeout(this.autoLogout, 4 * 60 * 1000);
      this.dialog = false;
    },
    resetTimer(type) {
      clearTimeout(this.warningTimer);
      clearTimeout(this.logoutTimer);
      if (type === "reset") {
        this.setTimer();
      }
    },
    extendSession() {
      this.dialog = false;
      this.resetTimer("reset");
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>

<style>
.dialog {
  padding: 20px;
}

.cardMain {
  display: flex;
  flex-direction: column;
}
</style>
