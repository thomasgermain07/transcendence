<template>
   <div>
     <div class="login" >
        <div class="col-md-12 form-wrapper">
          <h2> Login User </h2>
          <form id="create-post-form" @submit.prevent="Login">
               <div class="form-group col-md-12">
                <label for="title"> Name </label>
                <input type="text" id="user_name" v-model="name" name="title" class="form-control" placeholder="Enter Name">
               </div>
                <div class="form-group col-md-12">
                    <label for="title"> Email </label>
                    <input type="text" id="user_email" v-model="email" name="title" class="form-control" placeholder="Enter email">
                </div>
                    <div class="form-group col-md-12">
                    <label for="title"> Password </label>
                    <input type="text" id="user_password" v-model="password" name="title" class="form-control" placeholder="Enter Password">
                </div>
              <div class="form-group col-md-4 pull-right">
                  <button class="btn btn-success" type="submit"> login </button>
              </div>
            </form>
        </div>
    </div>
   </div>
</template>

<script>
import axios from "axios";
import router from "../routers/router";
import { useStore } from "vuex"
// import { response } from 'express';

export default {
  // setup() {
  //   const store = useStore();
  //   console.log(store);
  // },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      errors: [],
    };
  },
  methods: {
    Login() {
      let customerData = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      this.__PostLogin(customerData);
    },
    __PostLogin(data) {
      axios.defaults.headers.common = {
        "Content-Type": "application/json"
      }
      this.errors = [];
      axios.post(`/auth/login`, data, {
          withCredentials: true,
          credentials: 'include',
      }).then(resp => {
        this.$store.commit("addIsLogin", true);
        router.push({ path: "/user" });
      }).catch(err => {this.errors.push(err);
          console.log(err) });
    },
  }
};
</script>