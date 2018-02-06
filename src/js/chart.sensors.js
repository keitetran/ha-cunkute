/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */

// Demo data only
// ---------------------------
var sensorChart = (function () {
  "use strict";
  var res = {};

  $(document).ready(function () {

    if ($("#topWidgetChart").length > 0) {
      //Get the context of the Chart canvas element we want to select
      var ctx = document.getElementById("topWidgetChart").getContext("2d");
      var gradientStroke = ctx.createLinearGradient(500, 45, 100, 0);
      gradientStroke.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradientStroke.addColorStop(1, 'rgba(255, 255, 255, 1)');

      var gradientFill = ctx.createLinearGradient(500, 45, 100, 0);
      gradientFill.addColorStop(0, "rgba(255, 135, 101, 1)");
      gradientFill.addColorStop(1, "rgba(254, 96, 161, 1)");


      // Chart Options
      var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        legend: {
          display: false,
          position: 'bottom',
        },
        tooltips: {
          yPadding: 3,
          xPadding: 4,
          titleSpacing: 5,
          titleMarginBottom: 0,
          titleFontSize: 9,
          titleFontStyle: 'normal',
          titleFontColor: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          caretSize: 3,
          callbacks: { // Custom my tooltip
            title: function (tooltipItem, data) {
              return data['datasets'][0]['data'][tooltipItem[0]['index']] + data['datasets'][0]['label'];
            },
            label: function (tooltipItem, data) {
              return null; // hide label
            },
          },
        },
        hover: {
          mode: 'label'
        },
        scales: {
          xAxes: [{
            display: false,
            suggestedMin: 0,
            beginAtZero: true,
            ticks: {
              fontSize: 10,
              stepSize: 5,
              padding: 5,
              maxRotation: 0,
              callback: function (value, index, values) {
                return " ";
              }
            },
            gridLines: {
              display: false,
              color: "#f3f3f3",
              drawTicks: false,
            },
            scaleLabel: {
              display: false,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              max: 26,
            }
          }]
        },
        title: {
          display: false,
          text: 'Chart.js Line Chart - Legend'
        },
        annotation: {
          annotations: [{
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: 21,
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 1,
            label: {
              content: "TODAY",
              enabled: false,
              position: "left",
              backgroundColor: 'rgba(255,255,255,1)',
              fontSize: 9,
              xPadding: 3,
              yPadding: 3,
            }
          }]
        },
        animation: {
          onComplete: function () {
            var chartInstance = this.chart;
            var ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(10, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText("NHIỆT ĐỘ PHÒNG", 55, 20);

            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                if (dataset.data.length - 1 == index) {
                  ctx.fillText("10:30", bar._model.x + 15, bar._model.y + 15);

                  // TItle
                  ctx.font = Chart.helpers.fontString(10, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                  ctx.fillText(dataset.data[index] + "ºC", bar._model.x + 15, bar._model.y);
                }

              });
            });
          }
        },
      };

      // Chart Data
      var chartData = {
        labels: ["10:30", "10:31", "10:32", 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        datasets: [{
            label: "ºC",
            data: [25, 15, 13, 16, 18, 20, 21, 15, 13, 16, 18, 20, 21, 15, 13, 16, 18, 20, 21, 25, 16, 18],
            borderColor: "rgba(255, 255, 255, 1)",
            pointBorderColor: "rgba(255, 255, 255, 1)",
            pointBackgroundColor: "rgba(255, 255, 255, 1)",
            pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
            pointHoverBorderColor: "rgba(255, 255, 255, 1)",
            pointBorderWidth: 1,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 2,
            fill: true,
            borderWidth: 1,
          },
          // {
          // label: "%",
          // data: [60, 70, 62, 63, 65, 61, 72, 80, 51, 74, 76, 77, 80, 60, 51, 74, 76, 77, 80, 60, 51, 74, 76, 77, 80, 60],
          // backgroundColor: "rgba(81,117,224,.5)",
          // borderColor: "rgba(81,117,224,1)",
          // borderWidth: 1,
          // pointBorderColor: "rgba(81, 117, 224, 1)",
          // pointBackgroundColor: "#FFF",
          // pointBorderWidth: 1,
          // pointHoverBorderWidth: 1,
          // pointRadius: 2,
          // }
        ]
      };

      // Create the chart
      res.chart = new Chart(ctx, {
        type: 'line',
        options: chartOptions, // Chart Options
        data: chartData, // Chart Data
        lineAtIndex: [13],
      });
    }
  });

  return res;
})();