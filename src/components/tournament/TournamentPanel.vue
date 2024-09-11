<template>
  <div class="round-container-dark-small flex txt-col-darker">
    <span class="text-white">Ongoing tournament:</span>&nbsp;
    <span class="txt-col-green">{{ tournament.name }} </span>
  </div>
  <div class="pad10">
    <table class="tbl-fixed">
      <tbody>
        <tr>
          <td class="text-center">
            <div class="num-big txt-col-green">
              {{ tournament.participants }}
            </div>
            <div>players</div>
          </td>
          <td class="text-center">
            <div class="num-big txt-col-green">{{ tournament.scheduled }}</div>
            <div>scheduled games</div>
          </td>
          <td class="text-center">
            <div class="num-big txt-col-green">{{ tournament.finished }}</div>
            <div>finished games</div>
          </td>
          <td class="text-center">
            <div
              class="num-big txt-col-green"
              v-if="tournament.scheduled === 0"
            >
              0
            </div>
            <div class="num-big txt-col-green" v-else>
              {{
                ((tournament.finished * 100) / tournament.scheduled).toFixed(1)
              }}%
            </div>
            <div>tournament progress</div>
          </td>
          <td class="text-center">
            <div class="num-big txt-col-green">{{ tournament.sets }}</div>
            <div>sets played</div>
          </td>
          <td class="text-center">
            <div class="num-big txt-col-green">{{ tournament.points }}</div>
            <div>points scored</div>
          </td>
          <td class="text-right">
            <div>
              <router-link
                :to="'/tournament/' + this.tournament.id + '/results'"
                >all results <i class="far fa-play-circle"></i
              ></router-link>
            </div>
            <div>
              <router-link
                :to="'/tournament/' + this.tournament.id + '/schedule'"
                >full schedule <i class="far fa-play-circle"></i
              ></router-link>
            </div>
            <div>
              <router-link
                :to="'/tournament/' + this.tournament.id + '/standings'"
                >standings <i class="far fa-play-circle"></i
              ></router-link>
            </div>
            <div>
              <router-link
                :to="'/tournament/' + this.tournament.id + '/statistics'"
                >statistics <i class="far fa-play-circle"></i
              ></router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TournamentPanel",
  props: ["tournament"],
  data() {
    return {
      matches: [],
    };
  },
};
</script>
