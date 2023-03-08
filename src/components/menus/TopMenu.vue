<template>
  <div class="float-l">
    <nav>
      <RouterLink to="/"
        ><img src="@/assets/images/favicon.ico" class="logo" /> TTAPP
      </RouterLink>
      <RouterLink to="/tournaments">tournaments</RouterLink>
      <RouterLink to="/players">players</RouterLink>
      <RouterLink to="/leaders">leaders</RouterLink>
    </nav>
  </div>
  <div class="float-r padt20">
    office
    <select
      class="textInput"
      @change="changeOffice()"
      v-model="this.officeId"
      v-if="this.offices"
    >
      <template v-for="(office, index) in this.offices">
        <option :value="office.id" v-if="office" v-bind:key="office.id">
          {{ office.name }}
        </option>
      </template>
    </select>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      offices: [],
      officeId: 0,
    };
  },
  methods: {
    changeOffice() {
      localStorage.setItem("officeId", this.officeId);
      window.location.reload();
    },
  },
  mounted() {
    this.officeId = localStorage.getItem("officeId") ?? "1";
    axios
      .all([axios.get("/api/offices")])
      .then(
        axios.spread((o) => {
          this.offices = o.data;
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.logo {
  width: 16px;
  height: 16px;
}

.textInput {
  border: 1px solid rgba(84, 84, 84, 0.65);
  border-radius: 4px;
  padding: 5px 8px;
  background: var(--col-dark);
  color: white;
  font-size: 15px;
  font-family: inherit;
}

.textInput:focus {
  border: 1px solid rgba(200, 200, 200, 1);
  outline: rgba(200, 200, 200, 1);
}
</style>
