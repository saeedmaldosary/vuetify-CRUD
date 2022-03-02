<template>
  <div class="home pa-6">
    <div id="errorMsg" v-if="errorMsg">
      <v-alert text type="error" color="#d32f2f">
        {{ errorMsg }}
      </v-alert>
    </div>

    <div v-if="successMsg">
      <v-alert text type="success" color="#4caf50">
        {{ successMsg }}
      </v-alert>
    </div>

    <v-row align="center" class="mb-5">
      <v-col cols="12" sm="6">
        <v-card elevation="2">
          <v-chip label outlined class="ma-5">
            <v-icon left> mdi-filter-outline </v-icon>Filters</v-chip
          >
          <v-row align="center" class="mx-2">
            <v-col cols="12" sm="6">
              <v-text-field
                label="Customer ID"
                v-model="customerID"
                dense
                filled
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                :disabled="customerID ? true : false"
                :items="genders"
                v-model="customerID ? (gender = '') : gender"
                filled
                dense
                label="Gender"
              ></v-select>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: flex-end">
            <v-btn
              class="mr-5 mb-5"
              @click="reset"
              :loading="loading"
              dark
              style="background-color: #5cbbf6"
              >Reset</v-btn
            >
            <v-btn
              class="mr-5 mb-5"
              :loading="loading"
              @click="getCustomers"
              color="primary"
              >Search</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="customers"
      class="elevation-1"
      :loading="loading"
      id="customersTable"
      loading-text="loading Customers Data..."
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
    >
      <template v-slot:[`item.full_name`]="{ item }"
        >{{ item.first_name }} {{ item.last_name }}</template
      >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="userRole == 'Viewer'"
                color="primary"
                v-bind="attrs"
                id="newCustomerBtn"
                :loading="loading"
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
                      <v-autocomplete
                        v-model="editedItem.country_code"
                        item-text="name"
                        item-value="code"
                        :items="countries"
                        label="Country Code"
                      ></v-autocomplete>
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
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="editedItem.is_email_verified"
                        :items="verified"
                        label="Email Verified"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
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
          color="primary"
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          :disabled="userRole == 'Viewer'"
          small
          color="primary"
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
      <template v-slot:body.append>
        <div
          style="
            display: flex;
            justify-content: space-between;
          "
        >
          <v-select
            class="ml-5 mt-3"
            v-model="itemsPerPage"
            @change="getCustomers"
            style="min-width: 140px; max-width: 140px"
            :items="itemsPerPageList"
            label="Items per page"
          ></v-select>
          <v-btn
            class="ma-5"
            style="background-color: #5cbbf6"
            dark
            @click="generatePDF"
            >Export PDF</v-btn
          >
        </div>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
      itemsPerPage: 2,
      itemsPerPageList: [2, 5, 20],
      customerID: "",
      gender: "",
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
        { text: "Full Name", value: "full_name", sortable: false },
        { text: "Phone Number", value: "phone_number", sortable: false },
        { text: "Gender", value: "gender", sortable: false },
        { text: "Birth Date", value: "birth_date", sortable: false },
        { text: "Country Code", value: "country_code", sortable: false },
        { text: "Address", value: "address", sortable: false },
        { text: "Email Verified", value: "is_email_verified", sortable: false },
        { text: "ID Verified", value: "is_id_verified", sortable: false },
        { text: "National ID", value: "national_id", sortable: false },
        { text: "Status", value: "status", sortable: false },
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
      countries: [],
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

    itemsPerPage: function changeItemsPerPage() {
      this.page = 1;
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
    this.getCountries();
  },
  methods: {
    generatePDF() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();

      today = yyyy + mm + dd;

      const columns = [
        { title: "ID", dataKey: "id" },
        { title: "Email", dataKey: "email" },
        { title: "Name", dataKey: "first_name" },
        { title: "Gender", dataKey: "gender" },
        { title: "Birth Date", dataKey: "birth_date" },
        { title: "Country Code", dataKey: "country_code" },
      ];

      var doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      doc
        .setFontSize(16)
        .text("Customers Details " + yyyy + "-" + mm + "-" + dd, 0.5, 1.0);
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      doc.autoTable({
        columns,
        body: this.customers,
        margin: { left: 0.5, top: 1.25 },
      });

      doc.save(`${"CustomersDetails_" + today}.pdf`);
    },
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
        this.throwErrorMsg("Something went wrong. Please try again later.");
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
        this.throwErrorMsg("Something went wrong. Please try again later.");
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
        this.throwErrorMsg("Something went wrong. Please try again later.");
        this.saveLoading = false;
      }
    },

    async getCustomers() {
      this.loading = true;
      try {
        if (this.customerID == "") {
          if (this.gender == "") {
            var res = await axios.get(
              this.baseUrl +
                "?_page=" +
                this.page +
                "&_limit=" +
                this.itemsPerPage
            );
          } else {
            var res = await axios.get(
              this.baseUrl +
                "?_page=" +
                this.page +
                "&_limit=" +
                this.itemsPerPage +
                "&gender=" +
                this.gender
            );
          }
        } else {
          this.page = 1;
          var res = await axios.get(
            this.baseUrl +
              "?_page=" +
              this.page +
              "&_limit=" +
              this.itemsPerPage +
              "&id=" +
              this.customerID
          );
        }
        var headerLink = res.headers.link;

        var lastRelIndex = headerLink.lastIndexOf(",");
        var lastRel = headerLink.substring(lastRelIndex + 1);

        lastRel = lastRel.substring(0, lastRel.indexOf("&"));

        lastRelIndex = lastRel.lastIndexOf("=");
        var lastPage = Number(lastRel.substring(lastRelIndex + 1));

        if (lastPage != 0) {
          this.pageCount = lastPage;
        } else {
          this.pageCount = 1;
        }

        this.customers = res.data;

        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.throwErrorMsg("Something went wrong. Please try again later.");
      }
    },

    async getCountries() {
      try {
        var res = await axios.get("http://localhost:3000/countries");

        this.countries = res.data;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.throwErrorMsg("Something went wrong. Please try again later.");
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
        this.defaultItem.address.street = "";
        this.defaultItem.address.city = "";
        this.defaultItem.address.postal_code = "";
        this.editedItem.address.street = "";
        this.editedItem.address.city = "";
        this.editedItem.address.postal_code = "";
      }
      this.close();
    },

    reset() {
      this.customerID = "";
      this.gender = "";
      this.getCustomers();
    },
  },
};
</script>

<style></style>
