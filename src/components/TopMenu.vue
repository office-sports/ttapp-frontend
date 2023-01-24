<template>
  <div id="topMenuWrapper">
    <div id="topMenu">
      <div>
        <router-link to="/">TTAPP</router-link>
      </div>
      <div>
        <router-link to="/tournament/list">Tournaments</router-link>
      </div>
      <div>
        <router-link to="/player/list">Players</router-link>
      </div>
      <div class="rFloat">
        <div>
          <router-link to="/updates">updates</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TopMenu",
  data() {
    return {
      dropdown: false,
      offices: [],
      officeId: 1,
      officeName: "",
    };
  },
  mounted() {
    axios.get("/api/offices").then((res) => {
      this.offices = res.data;
      if (localStorage.getItem("ttappOfficeId") === null) {
        this.officeId = 1;
      } else {
        this.officeId = localStorage.getItem("ttappOfficeId");
      }
      this.officeName = this.offices[this.officeId - 1].name;
    });
  },
  methods: {
    setStorageOfficeId(officeId) {
      localStorage.setItem("ttappOfficeId", officeId);
      this.officeId = localStorage.getItem("ttappOfficeId");
      this.officeName = this.offices[this.officeId - 1].name;
      this.$router.push("/");
      this.toggleDropdown();
      this.$router.go(0);
    },
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
#topMenuWrapper {
  height: 50px;
  line-height: 50px;
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #313131;
}

#topMenu {
  max-width: var(--width-content);
  margin: 0 auto;

  div {
    display: inline-block;
    margin-right: 20px;

    a {
      text-decoration: none;
    }

    a:hover {
      color: #ffffff;
    }
  }
}
</style>
