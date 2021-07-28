<template>
	<div>
		<slot :duelTitle="'Duel'"
		:duelRules="'A duel is a one against one pong game. In this mode you can choose between three mapes to fight your opponent and three levels of difficulties. You can also choose if you want to fight with or without bonus options. Be Ready to enter the arena.'"
		:duelButton="'Play Duel'"
		:ladderTitle="'Ladder'"
		:ladderRules="'A Ladder is a one against one pong game. There is only one mape and one levels for this mode. If you wine in front of someone with a better level, his level became yours but if you are the one with a better level, you gone a loose it'"
		:ladderButton="'Play Ladder'">
		</slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',

  setup() {

		return ;
  },
})
</script>
