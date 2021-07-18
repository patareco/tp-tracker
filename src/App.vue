<template>
  <div id="app">
    <img alt="TP logo" src="./assets/tp.png" />
    <h1>Toilet Paper Tacker</h1>
    <p style="margin: 0"><small>A tool born out of necessity</small></p>

    <div v-if="!loading && !errored">
      <h2>Status</h2>
      <p :class="status + ' status'">{{ status }}</p>

      <div v-if="status == 'good'">
        <span v-for="(item, i) in info.slice(9, 10)" :key="'effort-' + i">
          {{ item.label.title }}
          <span :class="status + ' hl'">{{ item.value }} </span>
          <b>{{ item.label.unit }}</b>
        </span>
      </div>
      <div v-else>
        <span v-for="(item, i) in info.slice(9)" :key="'effort-' + i">
          {{ item.label.title }}
          <span :class="status + ' hl'">{{ item.value }} </span>
          <b>{{ item.label.unit }}</b>
        </span>
      </div>

      <h2>Stats</h2>
      <div class="row">
        <div v-for="(item, i) in info.slice(3, 9)" :key="'targets-' + i">
          <div class="row-v">
            <div>{{ item.label.title }}</div>
            <div
              :class="item.label.title.indexOf('date') > -1 ? 'date' : 'big'"
            >
              {{ item.value }}
            </div>
            <div>{{ item.label.unit }}</div>
          </div>
        </div>
      </div>

      <h2>Targets</h2>
      <div class="row">
        <div v-for="(item, i) in info.slice(0, 3)" :key="'targets-' + i">
          <div class="row-v">
            <div>{{ item.label.title }}</div>
            <div class="big">{{ item.value }}</div>
            <div>{{ item.label.unit }}</div>
          </div>
        </div>
      </div>

      <button @click="openUpdateStatusModal">Update Status</button>

      <div v-if="updateModalShow" id="update-modal">
        <div v-if="!updatingRolls">
          <h2>Update Nº Rolls</h2>
          <input
            type="number"
            name="number"
            placeholder="nº of tp rolls"
            @keyup.enter="updateRolls"
            v-model="numRollsUpdate"
            ref="input"
          />
          <button @click="updateRolls">Update</button>
        </div>
        <div v-else>
          <h2>Updating...</h2>
        </div>
        <div class="close">
          <button @click="openUpdateStatusModal">Close</button>
        </div>
      </div>

      <p>Don't worry, be happy! ❤</p>
    </div>
    <div v-else>
      <div v-if="loading">Loading</div>
      <div v-if="errored">Error Loading data</div>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from "axios";
import mapSheet from "./mapSheet.js";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      loading: true,
      errored: false,
      info: null,
      target: null,
      avg: null,
      updateModalShow: false,
      numRollsUpdate: false,
      updatingRolls: false,
    };
  },
  mounted() {
    this.getGSData();
  },
  computed: {
    status() {
      let target = parseFloat(this.target);
      let avg = parseFloat(this.avg);
      if (avg <= target) return "good";
      if (avg > target && avg <= target + 0.2) return "ok";
      if (avg > target + 0.2 && avg <= target + 0.7) return "bad";
      if (avg > target + 0.7) return "very bad";
      else return null;
    },
  },
  methods: {
    openUpdateStatusModal() {
      this.updateModalShow = !this.updateModalShow;
      if (this.updateModalShow) setTimeout(() => this.$refs.input.focus(), 200);
    },
    getGSData() {
      var that = this;
      // Make a request for a user with a given ID
      axios
        .get(
          "https://spreadsheets.google.com/feeds/cells/1FnuA1w242G_PzEfkiDj21FQlFLXFoNNNQ1SJ9gvdf5o/2/public/full?alt=json"
        )
        .then(function (response) {
          // handle success
          let info = mapSheet(response);
          that.info = info;
          that.target = info[0].value;
          that.avg = info[9].value;
          that.loading = false;
          console.log(info);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          that.errored = true;
        })
        .then(function () {
          // always executed
        });
    },
    updateRolls() {
      console.log(this.numRollsUpdate);
      let that = this;
      this.updatingRolls = true;

      let updateURL =
        process.env.NODE_ENV == "developement"
          ? "http://localhost:9999/"
          : "https://tp-tracker-91.netlify.app/";
      axios
        .get(
          updateURL +
            ".netlify/functions/addTPRows?number=" +
            this.numRollsUpdate
        )
        .then(function (response) {
          // handle success
          console.log(response);
          alert(response.data.status);
          that.getGSData();
          that.openUpdateStatusModal();
        })
        .catch(function (error) {
          // handle error
          alert("Request Failed!");
          console.log(error);
        })
        .then(function () {
          that.updatingRolls = false;
          // always executed
        });

      this.$refs.input.value = "";
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  max-width: 650px;
  margin: 0 auto;

  img {
    width: 30%;
    display: block;
    margin: 0 auto;
  }
}
h1 {
  line-height: 1.1em;
  margin-bottom: 0;
}
h2 {
  margin-bottom: 0.3em;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hl {
  font-weight: bold;
  color: #e83d3d;
}
.row {
  display: flex;
  flex-wrap: wrap;
  & > div {
    flex: 0 0 33.33%;
    margin-bottom: 1em;
  }
}
.row-v {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  & > div.big {
    font-size: 2.75em;
    font-weight: bold;
    margin-bottom: -0.25em;
  }
  & > div.date {
    font-weight: bold;
    padding-top: 1em;
  }
}

.status {
  font-weight: bold;
  font-size: 4.5em;
  padding: 0;
  margin: 0 0 0.2em;
  line-height: 1em;
  text-transform: uppercase;
}

.ok {
  color: #e88b3d;
}
.good {
  color: #34cc21;
}
.bad {
  color: #e83d3d;
}
.very.bad {
  background-color: #e83d3d;
  color: #fff;
  padding: 0.15em;
}
#update-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: RGBA(255, 255, 255, 0.8);
}
.close {
  margin-top: 2em;
}
</style>
