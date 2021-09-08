<template>
  <div class="game-home">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
    <h1>PONG GAME</h1>
    <div class="link-button">
      <div>
        <router-link v-bind:to="'/game/duel'" class="link-button-duel">
          Play Duel
        </router-link>
      </div>
      <div>
        <router-link v-bind:to="'/game/ladder'" class="link-button-ladder">
          Play Ladder
        </router-link>
      </div>
      <div>
        <button
          onclick="document.getElementById('id01').style.display='block'"
          class="link-button-rules"
        >
          Rules
        </button>
        <div id="id01" class="w3-modal">
          <div class="w3-modal-content">
            <div class="w3-container">
              <span
                onclick="document.getElementById('id01').style.display='none'"
                class="w3-button w3-display-topright"
                >&times;</span
              >
              <h2>Duel Rules</h2>
              <p>
                A duel is a one against one pong game. In this mode you can
                choose between three mapes to fight your opponent and three
                levels of difficulties. You can also choose if you want to fight
                with or without bonus options. The first Player with a score of
                5 win. Be Ready to enter the arena.
              </p>
              <h2>Ladder Rules</h2>
              <p>
                A Ladder is a one against one pong game. The first Player with a
                score of 5 win. There is only one mape and one levels for this
                mode. If you wine in front of someone with a better level, his
                level became yours but if you are the one with a better level,
                you gone a loose it
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'game-home',

  setup() {
    return
  },
})
</script>

<style scoped>
.game-home {
  height: 1000px;
  width: 100%;
  font-size: 200%;
  /* background-size: 30%; */
  /* background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5)
    ),
    url('../../assets/images/ultimatePong.png');
  margin: 0;
  padding: 30px;
  text-shadow: 1px 1px 2px pink; */

  /* position: center; */
  /* padding: 0;
  left: 0; */
}
.game-home h1 {
  text-align: center;
  font-size: 100%;
  font-weight: 700;
  margin-top: 60px;
}
.link-button {
  display: inline-table;
  width: 100%;
  /* background: #0a0a0a; */
  /* border: 4mm ridge rgba(170, 50, 220, .6); */
  /* margin: 6px auto 0; */
  padding: 1em;
  text-decoration: none;
  border-radius: 40px;
  text-align: center;
  font-size: 100%;
  font-weight: 700;

  text-shadow: 0 1px 0px #378ab4, 1px 0 0px #5dabcd, 1px 2px 1px #378ab4,
    2px 1px 1px #5dabcd, 2px 3px 2px #378ab4, 3px 2px 2px #5dabcd,
    3px 4px 2px #378ab4, 4px 3px 3px #5dabcd, 4px 5px 3px #378ab4,
    5px 4px 2px #5dabcd, 5px 6px 2px #378ab4, 6px 5px 2px #5dabcd,
    6px 7px 1px #378ab4, 7px 6px 1px #5dabcd, 7px 8px 0px #378ab4,
    8px 7px 0px #5dabcd;
  /* color: #bc2e1e; */
  color: #0a0a0a;

  /* box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset, 0px 0px 10px 0px #DE3964; */
  background-position: center;
  background-size: cover;
}

.link-button-duel {
  display: inline-table;
  width: 30%;
  border: 4mm ridge rgba(170, 50, 220, 0.6);
  /* margin: 60px auto 0; */
  padding: 1em;
  text-decoration: none;
  border-radius: 40px;
  /* text-align: center;
  font-size: 100%;
  font-weight: 700; */

  /* text-shadow: 0 1px 0px #378ab4, 1px 0 0px #5dabcd, 1px 2px 1px #378ab4, 2px 1px 1px #5dabcd, 2px 3px 2px #378ab4, 3px 2px 2px #5dabcd, 3px 4px 2px #378ab4, 4px 3px 3px #5dabcd, 4px 5px 3px #378ab4, 5px 4px 2px #5dabcd, 5px 6px 2px #378ab4, 6px 5px 2px #5dabcd, 6px 7px 1px #378ab4, 7px 6px 1px #5dabcd, 7px 8px 0px #378ab4, 8px 7px 0px #5dabcd; */
  /* color: #bc2e1e; */
  /* color: #0a0a0a; */

  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 10px 0px #de3964;
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5)
    ),
    url('../../assets/images/vs.png');
  background-position: center;
  background-size: cover;
}
.link-button-duel:hover {
  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 30px 0px #de3964;
}
.link-button-duel:hover:after {
  -webkit-transform: scale(1);
  transform: scale(1);
}
.link-button-duel:hover:before {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}

.link-button-ladder {
  display: inline-table;
  width: 30%;
  /* background: #0a0a0a; */
  border: 4mm ridge rgba(170, 50, 220, 0.6);
  margin: 20px auto 0;
  padding: 1em;
  text-decoration: none;
  border-radius: 40px;
  /* text-align: center;
  font-size: 100%;
  font-weight: 700;
  text-shadow: 0 1px 0px #378ab4, 1px 0 0px #5dabcd, 1px 2px 1px #378ab4, 2px 1px 1px #5dabcd, 2px 3px 2px #378ab4, 3px 2px 2px #5dabcd, 3px 4px 2px #378ab4, 4px 3px 3px #5dabcd, 4px 5px 3px #378ab4, 5px 4px 2px #5dabcd, 5px 6px 2px #378ab4, 6px 5px 2px #5dabcd, 6px 7px 1px #378ab4, 7px 6px 1px #5dabcd, 7px 8px 0px #378ab4, 8px 7px 0px #5dabcd;
  color: #0a0a0a; */

  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 10px 0px #de3964;
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5)
    ),
    url('../../assets/images/levelUp.png');
  background-position: center;
  background-size: cover;
}
.link-button-ladder:hover {
  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 30px 0px #de3964;
}
.link-button-ladder:hover:after {
  -webkit-transform: scale(1);
  transform: scale(1);
}
.link-button-ladder:hover:before {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}

.link-button-rules {
  display: inline-table;
  min-width: 30%;
  /* background: #0a0a0a; */
  border: 4mm ridge rgba(170, 50, 220, 0.6);
  margin: 20px auto 0;
  padding: 1em;
  text-decoration: none;
  border-radius: 40px;
  /* text-align: center;
  font-size: 100%;
  font-weight: 700; */
  text-shadow: 0 1px 0px #378ab4, 1px 0 0px #5dabcd, 1px 2px 1px #378ab4,
    2px 1px 1px #5dabcd, 2px 3px 2px #378ab4, 3px 2px 2px #5dabcd,
    3px 4px 2px #378ab4, 4px 3px 3px #5dabcd, 4px 5px 3px #378ab4,
    5px 4px 2px #5dabcd, 5px 6px 2px #378ab4, 6px 5px 2px #5dabcd,
    6px 7px 1px #378ab4, 7px 6px 1px #5dabcd, 7px 8px 0px #378ab4,
    8px 7px 0px #5dabcd;
  color: #0a0a0a;

  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 10px 0px #de3964;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 0, 0.5),
    rgba(0, 0, 255, 0.5)
  );
  /* background-position: center;
  background-size: cover; */
}
.link-button-rules:hover {
  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
    0px 0px 30px 0px #de3964;
}
.link-button-rules:hover:after {
  -webkit-transform: scale(1);
  transform: scale(1);
}
.link-button-rules:hover:before {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}
.w3-modal-content {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 0, 0.5),
    rgba(0, 0, 255, 0.5)
  );
  background-position: center;
  background-size: cover;
}
</style>
