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
          /* We give init value for errorMsg so we can access it because it's
          have v-if if we did not give a value we will not be able to test it */
          errorMsg: "Incorrect email or password.",
        };
      },
    });
  });

  it("Login button have Login text", () => {
    const loginBtn = wrapper.get('[data-test="loginBtn"]');

    expect(loginBtn.text()).toBe("Login");
  });

  it("Check if error massage exist", () => {
    const errorMsg = wrapper.get("#errorMsg");

    expect(errorMsg.text()).toEqual("Incorrect email or password.");
  });

  it("Login method exist", async () => {
    expect(wrapper.vm.login());
  });

  it("Login method is triggered", async () => {
    const login = jest.fn();

    await wrapper.setMethods({ login: login });

    await wrapper.find("[data-test='loginBtn']").trigger("click");

    expect(login).toHaveBeenCalled();
  });
});
