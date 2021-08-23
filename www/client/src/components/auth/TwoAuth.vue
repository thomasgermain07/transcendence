<template>
	<div class="google-authenticator">
	    <h3>Activate Google Authenticator</h3>
        <form @submit.prevent="submit">
            <button
            type="submit"
            >
            Activate Google Authenticator
            </button>
        </form>
        <div v-if="qrcode" class="qrcode">
          <img v-bind:src="qrcode" class="qrcode_picture" alt='qrcode' />
        </div>
	</div>
</template>

<script lang='ts'>
import { defineComponent }         from "vue";
import { ref, reactive, readonly } from "vue";

import { RegisterType } from "@/composables/auth";
import { useAuth }      from "@/composables/auth";

export default defineComponent({
    name: 'google-authenticator',

    setup()
    {
        const messages = ref([]);
        const qrcode = ref();

        const { activateTwoFa } = useAuth();
        const submit = () => {
            console.log("----------------HERRE-------")
            activateTwoFa()
                .then((response) => {
                    console.log("------")
                    console.log(response)
                    qrcode.value = response.data
                })
                .catch((err) => {
                    messages.value = err.response?.data.message;
                });
        };

        return {
            // Datas
            messages,
            qrcode,
            // Functions
            submit,
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
</style>
