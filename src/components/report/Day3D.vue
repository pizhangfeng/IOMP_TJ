<template>
  <div id="rightBottom">
    <div class="bg-color-black" ref="day3dRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  // 地区销量排行
  name: 'Day',
  //本月耗电量
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      allData: null,
      dayData: [],
      totalEle: 0,
      // days: ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Tuesday', 'Friday', 'Saturday'],
      // weeks: ['first week', 'second week', 'third week', 'fourth week', 'fifth week', 'sixth week'],
      data: [["月份",'日期','本月周次','星期','用电量'],
        [9, 26,'第一周','星期天', 0],
        [9, 27,'第一周','星期六', 0],
        [9, 28,'第一周','星期五', 0],
        [9, 29,'第一周','星期四', 0],
        [9, 30,'第一周','星期三', 0],
        [10, 1,'第一周','星期二', 4.52],
        [10, 2,'第一周','星期一', 5.33],
        [10, 3,'第二周','星期天', 5.12],
        [10, 4,'第二周','星期六', 6.12],
        [10, 5,'第二周','星期五', 7.22],
        [10, 6,'第二周','星期四', 5.16],
        [10, 7,'第二周','星期三', 9.12],
        [10, 8,'第二周','星期二', 7.88],
        [10, 9,'第二周','星期一', 5.74],
        [10, 10,'第三周','星期天', 6.66],
        [10, 11,'第三周','星期六', 4.98],
        [10, 12,'第三周','星期五', 7.45],
        [10, 13,'第三周','星期四', 6],
        [10, 14,'第三周','星期三', 5.78],
        [10, 15,'第三周','星期二', 4.8],
        [10, 16,'第三周','星期一', 6.3],
        [10, 17,'第四周','星期天', 8.6],
        [10, 18,'第四周','星期六', 6.45],
        [10, 19,'第四周','星期五', 5.45],
        [10, 20,'第四周','星期四', 7.54],
        [10, 21,'第四周','星期三', 4.37],
        [10, 22,'第四周','星期二', 6.78],
        [10, 23,'第四周','星期一', 8.11],
        [10, 24,'第五周','星期天', 7.66],
        [10, 25,'第五周','星期六', 9.2],
        [10, 26,'第五周','星期五', 6.12],
        [10, 27,'第五周','星期四', 5.78],
        [10, 28,'第五周','星期三', 6.56],
        [10, 29,'第五周','星期二', 7.89],
        [10, 30,'第五周','星期一', 5.88],
        [10, 31,'第六周','星期天', 8.88],
        [11, 1,'第六周','星期六', 4.99],
        [11, 2,'第六周','星期五', 0],
        [11, 3,'第六周','星期四', 0],
        [11, 4,'第六周','星期三', 0],
        [11, 5,'第六周','星期二', 0],
        [11, 6,'第六周','星期一', 0]]
    }
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      console.log('主题切换了')
      // 销毁当前的图表
      this.chartInstance.dispose()
      // 以最新主题初始化图表对象
      this.initChart()
      // 屏幕适配
      this.screenAdapter()
      // 渲染数据
      this.updateChart()
    },
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.screenAdapter)
    // 主动触发 响应式配置
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.day3dRef, this.theme)

      const initOption = {
        title: {
          text: '▎上月用电统计',
          left: 20,
          top: 20,
        },
        tooltip: {},
        visualMap: {
          max: 10,
          calculable: true,
          realtime: false,
          inRange: {
            // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
            color: ['#313695', '#4575b4', '#4575b4', '#4575b4', '#4575b4', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#a50026'],
          },
          textStyle: {
            color: '#fff',
          },
          outOfRange: {
            colorAlpha: 0,
          },
        },
        xAxis3D: {
          show: true,
          type: 'category',
          // data: this.days,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
        },
        yAxis3D: {
          type: 'category',
          // data: this.weeks,
        },
        zAxis3D: {
          // type: 'value',
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 150,
          axisLine: {
            lineStyle: { color: '#fff' },
          },
          axisPointer: {
            lineStyle: { color: '#fff' },
          },
          light: {
            main: {
              intensity: 1.2,
            },
            ambient: {
              intensity: 0.3,
            },
          },
        },
        dataset: {
          dimensions: ["月份",'日期','本月周次','星期','用电量'],
          source: this.data,
        },
        series: [
          {
            name: '用电量',
            type: 'bar3D',
            // data: this.data.map(function (item) {
            //   return {
            //     value: [item[1], item[0], item[2]],
            //   }
            // }),
            encode: {
              x: '星期',
              y: '本月周次',
              z: '用电量',
              // tooltip: [0, 1, 2, 3, 4],
            },
            shading: 'color',
            label: {
              show: false,
              textStyle: {
                fontSize: 16,
                borderWidth: 1,
              },
              formatter: params => {
                return params.value[4] + 'kw*h'
              },
            },

            itemStyle: {
              opacity: 0.7,
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: '#900',
                },
              },
              itemStyle: {
                color: '#900',
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
    },

    //随机数据
    randomData() {
      let date = new Date()
      for (let i = 0; i < date.getDate() - 1; i++) {
        this.dayData.push(Math.round(Math.random() * 6000) + 6000)
      }
    },
    // 发送请求，获取数据
    getData() {},
    // 更新图表配置项
    updateChart() {
      // 渐变色数组
      // ['#b0020E', '#AB6EE5'],
      // ['#2E72BF', '#23E5E5'],
      // ['#0BA82C', '#4FF778']
      const colorArr = [
        ['#DF0808', '#680808'],
        ['#0808DF', '#080868'],
        ['#08DF08', '#086808'],
      ]
      // 每日组成的数组

      //每日对应的用电量
      const dataOption = {
        xAxis: {
          data: this.dayInfo,
        },
        series: [
          {
            data: this.valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = null

                if (arg.value > 10000) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 8000) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }

                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // 0%
                  { offset: 0, color: targetColorArr[0] },
                  // 100%
                  { offset: 1, color: targetColorArr[1] },
                ])
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    // 根据图标容器的宽度 计算各属性、标签、元素的大小
    screenAdapter() {
      const titleFontSzie = (this.$refs.day3dRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSzie,
          },
        },
        series: [
          {
            barWidth: titleFontSzie * 0.5,
            itemStyle: {
              barBorderRadius: [titleFontSzie / 2, titleFontSzie / 2, 0, 0],
            },
            label: {
              fontSize: titleFontSzie * 0.2,
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
  },
}
</script>

<style lang="scss" scoped>
$box-height: 300px;
#rightBottom {
      padding: 16px;
  height: $box-height;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
}
</style>
