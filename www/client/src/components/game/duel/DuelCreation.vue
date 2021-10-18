<template>
  <div class="duel-window">
    <div class="top-bar">
      <i class="fas fa-times" style="visibility: hidden"></i>
      <p class="top-bar__title">
        Creating duel with
        <span class="top-bar__title--name">{{ Target.name }}</span>
      </p>
      <i class="fas fa-times top-bar__exit-btn" @click="closeWindow"></i>
    </div>
    <div class="content">
      <div class="section">
        <div class="section__title">Map</div>
        <div class="section__content">
          <div
            class="btn"
            @click="gameOptions.map = 'default'"
            :class="{
              'btn--selected': gameOptions.map == 'default',
            }"
          >
            Default
          </div>
          <div
            class="btn"
            @click="gameOptions.map = 'map1'"
            :class="{
              'btn--selected': gameOptions.map == 'map1',
            }"
          >
            Map 1
          </div>
          <div
            class="btn"
            @click="gameOptions.map = 'map2'"
            :class="{
              'btn--selected': gameOptions.map == 'map2',
            }"
          >
            Map 2
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section__title">Difficulty</div>
        <div class="section__content">
          <div
            class="btn"
            :class="{
              'btn--selected': gameOptions.difficulty == 'easy',
            }"
            @click="gameOptions.difficulty = 'easy'"
          >
            Easy
          </div>
          <div
            class="btn"
            :class="{
              'btn--selected': gameOptions.difficulty == 'medium',
            }"
            @click="gameOptions.difficulty = 'medium'"
          >
            Medium
          </div>
          <div
            class="btn"
            :class="{
              'btn--selected': gameOptions.difficulty == 'hard',
            }"
            @click="gameOptions.difficulty = 'hard'"
          >
            Hard
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section__title">Power Ups</div>
        <div class="section__content">
          <div
            class="btn"
            :class="{ 'btn--selected': gameOptions.powerUps }"
            @click="gameOptions.powerUps = true"
          >
            On
          </div>
          <div
            class="btn"
            :class="{ 'btn--selected': !gameOptions.powerUps }"
            @click="gameOptions.powerUps = false"
          >
            Off
          </div>
        </div>
      </div>
      <div class="section section--validation">
        <div class="btn btn--validation" @click="sendInvite">Invite</div>
        <div class="btn btn--validation" @click="closeWindow">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, reactive } from '@vue/runtime-core'
import { UserType } from '@/types/user/user'
import { DifficultyLevel, GameOptions, MapType } from '@/types/game/gameOptions'
import { closeModal } from 'jenesius-vue-modal'
import getInvitationInteraction from '@/composables/Game/invitationInteraction'
import { useGameInvite } from '@/composables/Game/useGameInvite'

export default {
  props: {
    Target: Object as PropType<UserType>,
  },
  setup(props) {
    let gameOptions: GameOptions = reactive({
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    })

    const { createInvitation } = getInvitationInteraction()

    const closeWindow = () => {
      closeModal()
    }

    const sendInvite = async () => {
      if ((await useGameInvite().checkIfCanInvite(props.Target!)) == false) {
        closeWindow()
        return
      }
      let invite = await createInvitation(gameOptions, props.Target!.id)
      useGameInvite().createInviteNotification(invite, props.Target!)
      closeWindow()
    }

    return {
      gameOptions,
      closeWindow,
      sendInvite,
    }
  },
}
</script>

<style scoped>
.duel-window {
  height: 50vh;
  width: 50vw;
  background-color: lightgray;
  outline: 2px solid var(--tertiary-color);
  outline-offset: 2px;
  display: flex;
  flex-direction: column;
}

.top-bar {
  border-bottom: 2px solid var(--tertiary-color);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.top-bar__title {
  padding: 5px;
  font-weight: bold;
  font-size: xx-large;
}

.top-bar__title--name {
  color: var(--primary-color);
}

.top-bar__exit-btn {
  padding: 5px;
  font-weight: bold;
  font-size: xx-large;
  cursor: pointer;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.section--validation {
  width: 60%;
  align-self: center;
}

.btn--validation {
  margin: 5px;
}

.btn--validation:hover {
  background-color: var(--secondary-color);
}

.section__title {
  display: inline-block;
  font-weight: 500;
  font-size: x-large;
  border-bottom: 2px solid var(--tertiary-color);
  margin-bottom: 8px;
}

.section__content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.btn {
  padding: 5px;
  border-radius: 3px;
  border: 2px solid var(--tertiary-color);
  font-size: large;
  font-weight: 500;
  cursor: pointer;
}

.btn--selected {
  background-color: var(--primary-color);
}
</style>
