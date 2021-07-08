<template>
  <div class="User">User View
    <div class="container-fluid">
      <div class="text-center">
        <h1>Profile</h1>
       <!-- <div v-if="users.length === 0">
            <h2> No Users found at the moment </h2>
        </div>
      </div> -->
        <div class="">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                 <div v-if="user" class="content">
                  <td>{{ this.user.name }}</td>
                 </div>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onBeforeMount } from 'vue';
import axios from "axios";
import { useRoute, useRouter } from 'vue-router';

// import authHeader from '../auth/auth-header';

// function authHeader() {
//   let user = JSON.parse(localStorage.getItem('usertoken'));
//   if (user) {
//     console.log(user);
//     return { Authorization: 'Bearer ' + user };
//   } else {
//     return {};
//   }
// }
export default {
  data() {
    return {
      user: []
    };
  },
  created() {
    const route = useRoute()
    const router = useRouter()
    onBeforeMount(() => {
      // check if user is loggedin
      axios
        .get(`auth`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then((response) => {
          console.log('User is logged in')
          console.log(response)
          this.fetchUsers();
        })
        .catch((err) => {
          console.log(err.response.data)
          
          console.log('User is not logged in')
          router.replace('login')
        })
    })
  },
  methods: {
    fetchUsers() {
      axios
        .get(`http://localhost:8080/api/auth`, {
          withCredentials: true,
          credentials: 'include',
          })
        .then(resp => {
          console.log(resp);
          this.user = resp.data;
        });
    },
    // deleteUser(id) {
    //   axios
    //     .delete(`http://localhost:3000/customer/delete?customerID=${id}`)
    //     .then(data => {
    //       console.log(data);
    //       window.location.reload();
    //     });
    // }
  }
};
</script>
