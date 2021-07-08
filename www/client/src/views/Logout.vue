<template>
   <div>
        <div class="logout" >
            <div class="col-md-12 form-wrapper">
                <h2> LogOut </h2>
                <form id="create-post-form" @submit.prevent="Logout">
                    <div class="form-group col-md-4 pull-right">
                        <button class="btn btn-success" type="submit"> logout </button>
                    </div>
                </form>
            </div>
        </div>
   </div>
</template>

<script>
import axios from "axios";
import router from "../routers/router";
import { useStore } from "vuex";

import { io } from 'socket.io-client';

// import { response } from 'express';
export default {

  methods: {
    Logout() {
      this.__submitToServer();
    },
    __submitToServer() {
      // const socket = io('http://localhost:8080/auth/logout');
      axios.defaults.headers.common = {
        "Content-Type": "application/json"
      }
        // const store = useStore();
        // console.log(store);
        axios.post(`/auth/logout`, null, {
            withCredentials: true,
            credentials: 'include',
        }).then(resp => {
            console.log(resp);
            this.$store.commit("addIsLogin", );
            router.push({ path: "/login" });
        }).catch(err => {
          console.log(err) });
      }
    }

};
</script>