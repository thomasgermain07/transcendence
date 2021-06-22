<template>
    <div class="container-fluid">
      <div class="text-center">
        <h1>User List</h1>
       <div v-if="users.length === 0">
            <h2> No Users found at the moment </h2>
        </div>
      </div>

        <div class="">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <!-- <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group" style="margin-bottom: 20px;">
                                  <router-link :to="{name: 'Edit', params: {id: user._id}}" class="btn btn-sm btn-outline-secondary">Edit User </router-link>
                                  <button class="btn btn-sm btn-outline-secondary" v-on:click="deleteUser(user._id)">Delete User</button>
                                </div>
                              </div> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    </div>
</template>
<script>
import axios from "axios";
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
        .get(`http://localhost:8080/api/users`)
        .then(data => (this.users = data.data));
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
