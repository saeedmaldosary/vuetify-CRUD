export default {
  methods: {
    throwErrorMsg(msg) {
      console.log(msg);
      this.errorMsg = msg;
      var self = this;
      setTimeout(function () {
        self.errorMsg = "";
      }, 5000);
    },
    throwSuccessMsg(msg) {
      this.successMsg = msg;
      var self = this;
      setTimeout(function () {
        self.successMsg = "";
      }, 5000);
    },
  },
};
