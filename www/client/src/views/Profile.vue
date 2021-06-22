<template>
  <div class="profile">
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
                  <td>{{ this.user.name }}</td>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
// import authHeader from '../auth/auth-header';

function authHeader() {
  let user = JSON.parse(localStorage.getItem('usertoken'));
  if (user) {
    console.log(user);
    return { Authorization: 'Bearer ' + user };
  } else {
    return {};
  }
}
export default {
  data() {
    return {
      users: []
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios
        .get(`http://localhost:8080/api/profile`, { headers: authHeader() })
        .then(data => {
          console.log(data.data.name);
          this.user = data.data;
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