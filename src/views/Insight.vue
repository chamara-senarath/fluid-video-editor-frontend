<template>
  <v-container fluid>
    <v-layout row>
      <v-flex v-for="(card, index) in cardList" :key="index" xs12 md3 pa-2>
        <v-card dark :color="`${card.color} lighten-1`">
          <v-card-title :class="`${card.color} darken-1`">
            {{ card.title }}
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
    <v-layout mt-2 row>
      <v-flex
        xs12
        md4
        pa-2
        v-for="(pieChart, index) in pieChartList"
        :key="index"
      >
        <v-card color="white">
          <v-card-title class="black--text">
            Views By {{ pieChart.title }}
          </v-card-title>
          <VueApexCharts
            type="donut"
            height="300px"
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

export default {
  components: {
    VueApexCharts
  },
  data() {
    return {
      cardList: [
        {
          title: "Total Views",
          color: "green",
          icon: "clock",
          value: "1920"
        },
        {
          title: "Views in Last Week",
          color: "purple",
          icon: "clock",
          value: "18"
        },
        {
          title: "Views in Last Month",
          color: "red",
          icon: "clock",
          value: "120"
        },
        {
          title: "Views in Last Year",
          color: "blue",
          icon: "clock",
          value: "900"
        }
      ],
      pieChartList: [
        {
          title: "Gender",
          options: {
            labels: ["Male", "Female"]
          },
          series: [44, 56]
        },
        {
          title: "Age",
          options: {
            labels: ["18-25", "25-30", "30-40", "40+"]
          },
          series: [54, 60, 41, 17]
        },
        {
          title: "Location",
          options: {
            labels: ["Colombo", "Kandy", "Galle", "Matale"]
          },
          series: [44, 65, 46, 17]
        }
      ]
    };
  }
};
</script>
