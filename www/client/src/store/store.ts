import { createStore, useStore as baseUseStore, Store} from 'vuex';
// import {createMutationsSharer} from 'vuex-shared-mutations';
import { InjectionKey } from 'vue';
import Player from './modules/player';


// define your typings for the store state


export const store = createStore({
    // state: {},
    // modules: {
    //     player: Player,
    // },
})
// export const store = createStore<State>({
//     state: {
//         rightX: 600/10,
//         rightY:  400/2 - 40,

//         leftX: 600/1.1,
//         leftY: 400/2 - 40,
//         context: null,
//         move: "",
//     },

//     getters: {
//     },

//     mutations: {
//         updateposition(state, resp) {
//             state.rightX = resp.rightX;
//             state.rightY = resp.rightY;
//             console.log("updateposition");
//             console.log(state.rightY);
//         },

//     },
    
//     actions: {

//     },
//     modules: {
//     }
// })

// export const store = createMutationsSharer<State>({
//     state: {
//         user: {},
//         isLogin: false
//     },

//     getters: {
//         getUser(state: State) {
//             console.log(state.user);
//             return state.user
//         },
//         getIsLogin(state: State) {
//             console.log(state.isLogin);
//             return state.isLogin;
//         }
//     },

//     mutations: {
//         addResponse(state, resp) {
//             state.user = resp;
//             console.log("addResponse");
//             console.log(state.user);
//         },

//         addIsLogin(state, bool) {
//             state.isLogin = bool;
//             console.log("addResponse");
//             console.log(state.isLogin);
//         }

//     },
    
//     actions: {

//     },
//     modules: {
//     }
// })

// export function useStore () {
//     return baseUseStore(key)
// }
  