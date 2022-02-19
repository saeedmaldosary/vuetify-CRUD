<template>
  <div class="home pa-6">
    <div v-if="errorMsg">
      <v-alert text type="error" color="#d32f2f">
        {{ errorMsg }}
      </v-alert>
    </div>

    <div v-if="successMsg">
      <v-alert text type="success" color="#4caf50">
        {{ successMsg }}
      </v-alert>
    </div>

    <h2 class="mb-3">Customers Details</h2>
    <v-data-table
      :headers="headers"
      :items="customers"
      class="elevation-1"
      :loading="loading"
      loading-text="loading Customers Data..."
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="userRole == 'Viewer'"
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Customer
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.id"
                        v-if="formTitle == 'Edit Customer'"
                        disabled
                        label="ID"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        type="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.first_name"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.last_name"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.phone_number"
                        label="Phone Number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.gender"
                        :items="genders"
                        label="Gender"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.birth_date"
                            label="Birthday date"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.birth_date"
                          :active-picker.sync="activePicker"
                          :max="
                            new Date(
                              Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .substr(0, 10)
                          "
                          min="1950-01-01"
                          @change="saveDatePicker"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.country_code"
                        label="Country Code"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.street"
                        label="Street"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.city"
                        label="City"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.postal_code"
                        label="Postal Code"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.is_email_verified"
                        :items="verified"
                        label="Email Verified"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.is_id_verified"
                        :items="verified"
                        label="ID Verified"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.status"
                        :items="status"
                        label="Status"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.national_id"
                        label="National ID"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :loading="saveLoading"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                >Are you sure you want to delete this customer?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  :loading="saveLoading"
                  text
                  @click="deleteItemConfirm"
                >
                  Save
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogAddressDetails" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.street"
                        label="Street"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.city"
                        label="City"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.address.postal_code"
                        label="Postal Code"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeAddressDetails">
                  close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          :disabled="userRole == 'Viewer'"
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          :disabled="userRole == 'Viewer'"
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.address="{ item }">
        <v-icon @click="showAddressDetails(item)" color="primary"
          >mdi-menu-open</v-icon
        >
      </template>
    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import utils from "@/mixins/utils.js";

export default {
  mixins: [utils],
  data() {
    return {
      baseUrl: "http://localhost:3000/customers",
      customers: [],
      activePicker: null,
      date: null,
      menu: false,
      dialog: false,
      errorMsg: "",
      successMsg: "",
      loading: false,
      saveLoading: false,
      dialogDelete: false,
      dialogAddressDetails: false,
      page: 1,
      pageCount: 0,
      totalRecords: 0,
      itemsPerPage: 2,
      verified: [true, false],
      genders: ["MALE", "FEMALE"],
      status: ["ACTIVE", "INACTIVE"],
      userRole: "",
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "Email",
          sortable: false,
          value: "email",
        },
        { text: "First Name", value: "first_name" },
        { text: "Last Name", value: "last_name" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Gender", value: "gender" },
        { text: "Birth Date", value: "birth_date" },
        { text: "Country Code", value: "country_code" },
        { text: "Address", value: "address" },
        { text: "Email Verified", value: "is_email_verified" },
        { text: "ID Verified", value: "is_id_verified" },
        { text: "National ID", value: "national_id" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      addressDetails: false,
      editedItem: {
        first_name: "",
        last_name: "",
        phone_number: "",
        gender: "",
        birth_date: "",
        country_code: "",
        address: {
          street: "",
          city: "",
          postal_code: "",
        },
        is_email_verified: null,
        is_id_verified: null,
        national_id: "",
        status: "",
      },
      defaultItem: {
        first_name: "",
        last_name: "",
        phone_number: "",
        gender: "",
        birth_date: "",
        country_code: "",
        address: {
          street: "",
          city: "",
          postal_code: "",
        },
        is_email_verified: null,
        is_id_verified: null,
        national_id: "",
        status: "",
      },
    };
  },

  computed: {
    formTitle() {
      return this.addressDetails == true
        ? "Address Details"
        : this.editedIndex === -1
        ? "New Customer"
        : "Edit Customer";
    },
  },

  watch: {
    page: function changePage() {
      this.getCustomers();
    },

    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogAddressDetails(val) {
      val || this.closeAddressDetails();
    },

    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "login" });
    }
    var userObj = JSON.parse(user);
    this.userRole = userObj[0].role;
    this.getCustomers();
  },
  methods: {
    async addCustomer() {
      this.saveLoading = true;
      try {
        const res = await axios.post(this.baseUrl, {
          email: this.editedItem.email,
          first_name: this.editedItem.first_name,
          last_name: this.editedItem.last_name,
          phone_number: this.editedItem.phone_number,
          gender: this.editedItem.gender,
          birth_date: this.editedItem.birth_date,
          country_code: this.editedItem.country_code,
          address: {
            street: this.editedItem.address.street,
            city: this.editedItem.address.city,
            postal_code: this.editedItem.address.postal_code,
          },
          is_email_verified: this.editedItem.is_email_verified,
          is_id_verified: this.editedItem.is_id_verified,
          national_id: this.editedItem.national_id,
          status: this.editedItem.status,
        });
        await this.getCustomers();
        this.throwSuccessMsg("Customer was successfully added.");
        this.saveLoading = false;
      } catch (e) {
        console.log(e);
        this.throwErrorMsg("Error happen when adding the customer.");
        this.saveLoading = false;
      }
    },

    async editCustomer() {
      this.saveLoading = true;
      try {
        const res = await axios.put(this.baseUrl + "/" + this.editedItem.id, {
          email: this.editedItem.email,
          first_name: this.editedItem.first_name,
          last_name: this.editedItem.last_name,
          phone_number: this.editedItem.phone_number,
          gender: this.editedItem.gender,
          birth_date: this.editedItem.birth_date,
          country_code: this.editedItem.country_code,
          address: {
            street: this.editedItem.address.street,
            city: this.editedItem.address.city,
            postal_code: this.editedItem.address.postal_code,
          },
          is_email_verified: this.editedItem.is_email_verified,
          is_id_verified: this.editedItem.is_id_verified,
          national_id: this.editedItem.national_id,
          status: this.editedItem.status,
        });
        await this.getCustomers();
        this.throwSuccessMsg("Customer was successfully edited.");
        this.saveLoading = false;
      } catch (e) {
        console.log(e);
        this.throwErrorMsg("Error happen when edit the customer.");
        this.saveLoading = false;
      }
    },

    async deleteCustomer() {
      this.saveLoading = true;
      try {
        const res = await axios.delete(this.baseUrl + "/" + this.editedItem.id);
        this.page = 1;
        await this.getCustomers();
        this.throwSuccessMsg("Customer was successfully deleted.");
        this.saveLoading = false;
      } catch (e) {
        console.log(e);
        this.throwErrorMsg("Error happen when delete the customer.");
        this.saveLoading = false;
      }
    },

    async getCustomers() {
      this.loading = true;
      try {
        const res = await axios.get(
          this.baseUrl + "?_page=" + this.page + "&_limit=" + this.itemsPerPage
        );
        var headerLink = res.headers.link;

        var lastRelIndex = headerLink.lastIndexOf(",");
        var lastRel = headerLink.substring(lastRelIndex + 1);

        lastRel = lastRel.substring(0, lastRel.indexOf("&"));

        lastRelIndex = lastRel.lastIndexOf("=");
        var lastPage = Number(lastRel.substring(lastRelIndex + 1));

        this.pageCount = lastPage;

        this.customers = res.data;

        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.throwErrorMsg("Error happen when getting the customers.");
      }
    },

    saveDatePicker(date) {
      this.$refs.menu.save(date);
    },

    showAddressDetails(item) {
      this.addressDetails = true;
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogAddressDetails = true;
    },

    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.deleteCustomer();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeAddressDetails() {
      this.addressDetails = false;
      this.dialogAddressDetails = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.customers[this.editedIndex], this.editedItem);
        await this.editCustomer();
      } else {
        await this.addCustomer();
      }
      this.close();
    },

    getNumberOfPagesShown() {
      var string = (this.page - 1) * this.itemsPerPage + 1 + "-";
      if (this.page * this.itemsPerPage <= this.totalRecords) {
        string = string + this.page * this.itemsPerPage;
      } else {
        string = string + this.totalRecords;
      }

      return string;
    },
  },
};
</script>
