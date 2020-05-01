<template>
  <v-container fluid>
    <v-layout row>
      <v-flex v-for="(card, index) in cardList" :key="index" xs12 md3 pa-2>
        <v-card dark :color="`${card.color} lighten-1`">
          <v-card-title :class="`${card.color} darken-1`">
            {{ $t(card.title) }}
          </v-card-title>
          <v-card-text>
            <v-layout mt-4 row align-center mx-2 justify-space-between>
              <v-flex xs4>
                <v-icon large>fa fa-{{ card.icon }}</v-icon>
              </v-flex>
              <v-flex xs4>
                <span class="display-2 float-right">{{ card.value }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout mt-2 row justify-center>
      <v-flex
        xs12
        md6
        xl4
        pa-2
        v-for="(pieChart, index) in pieChartList"
        :key="index"
      >
        <v-card color="white">
          <v-card-title class="black--text">
            <v-layout row justify-space-between>
              <v-flex xs8>
                {{ $t("Views By") }} {{ $t(pieChart.title) }}
              </v-flex>
            </v-layout>
          </v-card-title>
          <VueApexCharts
            v-if="showPieCharts"
            type="donut"
            height="300"
            :options="pieChart.options"
            :series="pieChart.series"
          ></VueApexCharts>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
export default {
  components: {
    VueApexCharts,
  },
  data() {
    return {
      editRangeDialog: false,
      vid: null,
      showPieCharts: false,
      rangeList: [18, 25, 30, 40],
      cardList: [
        {
          title: "Total Views",
          color: "green",
          icon: "clock",
          value: null,
        },
        {
          title: "Views in Last Week",
          color: "purple",
          icon: "clock",
          value: null,
        },
        {
          title: "Views in Last Month",
          color: "red",
          icon: "clock",
          value: null,
        },
        {
          title: "Views in Last Year",
          color: "blue",
          icon: "clock",
          value: null,
        },
      ],
      pieChartList: [
        {
          title: "Team",
          options: {
            labels: [],
          },
          series: [],
        },
        {
          title: "Position",
          options: {
            labels: [],
          },
          series: [],
        },
        {
          title: "Gender",
          options: {
            labels: [],
          },
          series: [],
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      this.showPieCharts = false;
      try {
        let result = await axios.get(
          this.API_URL + `/api/insight/views?vid=${this.vid}`
        );
        this.cardList[0].value = result.data.totalViews;
        this.cardList[1].value = result.data.lastWeekViews;
        this.cardList[2].value = result.data.lastMonthViews;
        this.cardList[3].value = result.data.lastYearViews;

        result.data.viewsByTeam.forEach((team) => {
          this.pieChartList[0].options.labels.push(team.label);
          this.pieChartList[0].series.push(team.value);
        });
        result.data.viewsByPosition.forEach((position) => {
          this.pieChartList[1].options.labels.push(position.label);
          this.pieChartList[1].series.push(position.value);
        });
        result.data.viewsByGender.forEach((gender) => {
          this.pieChartList[2].options.labels.push(gender.label);
          this.pieChartList[2].series.push(gender.value);
        });
        this.showPieCharts = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.vid = this.$route.params.vid;
    if (this.vid != null) {
      this.fetchData();
    }
  },
};
</script>
