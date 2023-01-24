<template>
  <div id="top">
    <div class="marb25">
      <i class="fas fa-bullseye"></i> <span class="txtHeader padr10"> Standings </span>
      <span
        v-for="group in groups"
        v-bind:key="group.group_id"
        class="header-title-abbs"
      >
          <a href="#" v-scroll-to="'#group-' + group.group_id">{{
              group.group_abbreviation
            }}</a>
          .
        </span>
    </div>
  </div>
  <div
      v-for="group in groups"
      v-bind:key="group.group_id"
      :id="'group-' + group.group_id"
  >
    <div class="roundWrapper marb25">
      <div class="group-header">
          <span class="txtHeader">
            {{ group.group_name }}
          </span>
        <span class="anchor-top">
            <a href="#" v-scroll-to="'#top'">
              TOP&nbsp;&nbsp;
              <span class="header-icon"
              ><i class="fas fa-arrow-circle-up"></i
              ></span>
            </a>
          </span>
      </div>
      <div>
        <table class="collapse">
          <tr class="group-row-header">
            <th class="txtl">name</th>
            <th class="txtc">played</th>
            <th class="txtc">w / d / l</th>
            <th class="txtc">sets</th>
            <th class="txtc">+/-</th>
            <th class="txtc">rallies</th>
            <th class="txtc">+/-</th>
            <th class="txtc">points</th>
          </tr>
          <tr
              v-for="(player, index) in group.players"
              v-bind:key="player.playerId"
              class="group-container player-row"
          >
            <td :class="['level', 'level-c' + player.pos_color]">
              <span style="color: black">{{ index + 1 }} .</span>
              <router-link :to="'/player/' + player.player_id + '/profile'">{{
                  player.player_name
                }}
              </router-link>
            </td>
            <td class="txtc">{{ player.played }}</td>
            <td class="txtc">
              {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
            </td>
            <td class="txtc">
              {{ player.sets_for }} - {{ player.sets_against }}
            </td>
            <td class="txtc">{{ player.sets_diff }}</td>
            <td class="txtc">
              {{ player.rallies_for }} - {{ player.rallies_against }}
            </td>
            <td class="txtc">{{ player.rallies_diff }}</td>
            <td class="txtc">{{ player.points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      tournament: null,
      groups: [],
    };
  },
  mounted() {
    axios
        .get("/api/tournaments/" + this.$route.params.id + "/standings")
        .then((res) => {
          this.groups = res.data;
        });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header-title {
  color: white;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 40px;
  margin-right: 40px;
}

.level {
  padding: 3px 3px 3px 15px;
  width: 300px;

  a {
    color: black;
  }
}

.level-c1 {
  background-color: #93c47d;
}

.level-c2 {
  background-color: #b6d7a8;
}

.level-c3 {
  background-color: #d9ead3;
}

.level-c4 {
  background-color: #fff2cc;
}

.level-c5 {
  background-color: #e6b8af;
}

.level-c11 {
  background-color: #b6d7a8;
}

.level-c22 {
  background-color: #d9ead3;
}

.level-c33 {
  background-color: #fff2cc;
}

.level-c44 {
  background-color: #fce5cd;
}

.level-c55 {
  background-color: #f4cccc;
}

.level-c66 {
  background-color: #e6b8af;
}

.empty-th,
.empty-td {
  width: 30px;
}

.playerLink {
  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}

.header-title-abbs {
  color: #3e3e3e;
  font-weight: 600;
  margin-bottom: 40px;

  a {
    text-decoration: none;
  }
}

.anchor-top {
  float: right;

  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    color: white;
  }
}

.group-container {
  width: 100%;
  margin-bottom: 25px;
}

.group-header {
  background: rgb(41, 137, 136);
  padding: 10px 20px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 300;
  font-size: 18px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.group-row-header {
  text-transform: uppercase;
  color: white;

  th {
    padding-bottom: 5px;
  }

  :nth-child(2) {
    width: 250px;
    padding-left: 10px;
  }
}

.group-body {
  color: white;
  background-color: #0e3c46;
  padding: 10px 20px 20px;

  table {
    width: 100%;
  }
}

.table-player-list {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;
}

.collapse {
  border-collapse: collapse;

  tr:last-child {
    border-bottom: none;
  }
}

.player-row {
  :nth-child(2) {
    padding-left: 10px;
  }

  border-bottom: 1px solid #ffffff1f;
}
</style>
