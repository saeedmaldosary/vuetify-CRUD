import Login from "@/views/Login.vue";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";

describe("Login.vue", () => {
  let vuetify;
  let localVue;
  let wrapper;
  localVue = createLocalVue();
  vuetify = new Vuetify();

  beforeEach(() => {
    wrapper = mount(Login, {
      vuetify,
      localVue,
      data() {
        return {
          errorMsg: "Incorrect email or password.",
        };
      },
    });
  });

  it("Login button have Login text", () => {
    const loginBtn = wrapper.get('[data-test="loginBtn"]');

    expect(loginBtn.text()).toBe("Login");
  });

  it("Check if error massage appear", () => {
    const errorMsg = wrapper.get("#errorMsg");

    expect(errorMsg.text()).toEqual("Incorrect email or password.");
  });
});
