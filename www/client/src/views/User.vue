<template>
   <div>
     <div class="user" >
        <div class="col-md-12 form-wrapper">
          <h2> Create User </h2>
          <form id="create-post-form" @submit.prevent="User">
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
              </div>           </form>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../routers/router";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    User() {
      let customerData = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      this.__submitToServer(customerData);
    },
    __submitToServer(data) {
      axios.defaults.headers.common = {
        "Content-Type": "application/json"
      }
      // console.log(data);
      axios.post(`/auth/login`, data ).then(data => {
        if (data.data) {
          localStorage.setItem('usertoken', JSON.stringify(data.data["access_token"]));
        }
        // axios.defaults.headers.common['Authorization'] = data.data;
        console.log(data);
        // console.log(data.data.headers);
        // console.log(axios.defaults.headers.common['Authorization']);
        // router.push({ path: "/" });
      });
    }
  }
};
</script>

