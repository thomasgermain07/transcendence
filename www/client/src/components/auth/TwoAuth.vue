<template>
	<div class="google-authenticator">
	    <h3>Activate Google Authenticator</h3>
        <div class="switch">
              <input id="switch-1" type="checkbox" class="switch-input" v-model="switchTwoFa.state"/>
              <label for="switch-1" class="switch-label">Switch</label>
        </div>
        <div v-if="qrcode" class="qrcode">
          <img v-bind:src="qrcode" class="qrcode_picture" alt='qrcode' />
        </div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, watch }         from "vue";
import { ref, reactive, readonly } from "vue";

import { RegisterType } from "@/composables/auth";
import { useAuth }      from "@/composables/auth";

export default defineComponent({
    name: 'google-authenticator',

    setup()
    {
        const messages = ref([]);

        const qrcode = ref();

        const { activateTwoFa, deactivateTwoFa, user } = useAuth();
        const switchTwoFa = reactive({
            state: user.isTwoFactorAuthenticationEnabled
        })  

        // const submit = () => {
        //     console.log("----------------HERRE-------")
        //     activateTwoFa()
        //         .then((response) => {
        //             console.log("------")
        //             console.log(response)
        //             qrcode.value = response.data
        //         })
        //         .catch((err) => {
        //             messages.value = err.response?.data.message;
        //         });
        // };
        watch(
            () => switchTwoFa.state,
            () => {
                if (switchTwoFa.state === true) {
                    activateTwoFa()
                        .then((response) => {
                            console.log("------")
                            console.log(response)
                            qrcode.value = response.data
                        })
                        .catch((err) => {
                            messages.value = err.response?.data.message;
                        });
                }
                else {
                    deactivateTwoFa()
                        .then((response) => {
                            console.log("------")
                            console.log(response)
                        })
                        .catch((err) => {
                            messages.value = err.response?.data.message;
                        });
                }
            }
        )

        return {
            // Datas
            messages,
            qrcode,
            switchTwoFa,
            user,
            // Functions
            // submit,
        };
    }

});
</script>

<style scoped>
.google-authenticator  {
    background: rgb(230, 163, 64);
}
.qrcode_picture {
  width: 50%;
  height: 50%;
}
/* Power Ups Switch button */
.switch {
  position: relative;
  display: inline-block;
  margin: 20px;
}
.switch-input {
  display: none;
}
.switch-label {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
}
.switch-label::before,
.switch-label::after {
  content: "";
  display: block;
  position: absolute;
  cursor: pointer;
}
.switch-label::before {
  width: 100%;
  height: 100%;
  background-color: #dedede;
  border-radius: 9999em;
  -webkit-transition: background-color 0.25s ease;
  transition: background-color 0.25s ease;
}
.switch-label::after {
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
  -webkit-transition: left 0.25s ease;
  transition: left 0.25s ease;
}
.switch-input:checked + .switch-label::before {
  background-color: green;
}
.switch-input:checked + .switch-label::after {
  left: 24px;
}
</style>
