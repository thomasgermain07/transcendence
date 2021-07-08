// import axios from 'axios';
// export default defineComponent({
//   name: 'App',
//   components: {
//     NavigationBar,
//   },
//   setup() {
//     const route = useRoute()
//     const router = useRouter()
//     onBeforeMount(() => {
//       // check if user is loggedin
//       axios
//         .get(`auth`, {
//           withCredentials: true,
//           credentials: 'include',
//         })
//         .then((response) => {
//           console.log('User is logged in')
//           console.log(response)
//           router.replace('/')
//         })
//         .catch((err) => {
//           console.log(err.response.data)

//           console.log('User is not logged in')
//           router.replace('login')
//         })
//     })
//     return {route}
//   }
// });
// </script>
// <style>
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
// </style>