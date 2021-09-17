<template>
  <div class="game-achievements">
    <!-- {{ achievements }} -->
    <ul>
      <li class="achievement" v-bind:class="{ locked: achievement.locked }" v-for="achievement in achievements" v-bind:key="achievement.id">
        <div class="details">
          <div class="name">{{ achievement.name }}</div>
          <div class="description">{{ achievement.description }}</div>
          <div v-if="!achievement.locked">
            <p class="unlocked"><i class="fas fa-check"></i> UNLOCKED</p>
            <!-- <p class="unlocked"><i class="fas fa-trophy"></i> UNLOCKED</p> -->
          </div>
          <div v-else>
            <p><i class="fas fa-lock"></i> LOCKED</p>
          </div>
        </div>
        <div class="logo">
          <img :src="achievement.image" alt="img" srcset="">
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'GameStats',
  props: ['user'],

  setup(props) {
    const user = ref(props.user)
    const achievements = ref(props.user.achievements)


    watch(
      () => props.user,
      () => {
        user.value = props.user
        achievements.value = props.user.achievements
      },
    )

    return {
      user,
      achievements,
    }
  },
})
</script>

<style scoped>
li {
  /* border: solid 1px white; */
  display: flex;
  margin: 40px 20px;
}

.locked {
  color: rgba(128, 128, 128, 0.61);
}

.locked p {
  color: #ed553b;
}

.locked img {
  filter: grayscale(1);
}

.details {
 flex: 2;
 text-align: left;
 margin: auto;
}

.details .name {
  font-size: 16px;
  font-weight: 800;
}

.details .description {
  font-size: 12px;
  padding-bottom: 5px;
}

.details .unlocked {
  color: #3caea3;
  font-weight: 800;
}

.logo {
  flex: 1;
}

.logo img {
  width: 40px;
  height: 40px;
}

</style>
