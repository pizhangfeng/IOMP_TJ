<template>
  <div class="com-container">
    <div class="com-chart" ref="dayRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Day',
  //本月耗电量
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      allData: null,
      dayData: [],
      totalEle: 0,
      dayInfo: [
        '10/1',
        '10/2',
        '10/3',
        '10/4',
        '10/5',
        '10/6',
        '10/7',
        '10/8',
        '10/9',
        '10/10',
        '10/11',
        '10/12',
        '10/13',
        '10/14',
        '10/15',
        '10/16',
        '10/17',
        '10/18',
        '10/19',
        '10/20',
        '10/21',
        '10/22',
        '10/23',
        '10/24',
        '10/25',
        '10/26',
        '10/27',
        '10/28',
        '10/29',
        '10/30',
      ],
      valueArr: [
        6400, 8723, 5390, 11120, 6700, 8911, 11456, 9673, 7890, 10256, 6512, 7723, 8540, 6677, 9624, 8955, 6780, 12330, 8730, 6666, 8356, 8888, 7653, 9321,
        8912, 10240, 9666,8611
      ],
    }
  },
  created() {
    this.getTotalEle()
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
      this.chartInstance = this.$echarts.init(this.$refs.dayRef, this.theme)

      const initOption = {
        title: {
          text: '▎每日用电量',
          left: 20,
          top: 20,
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          // 把x轴和y轴纳入 grid
          containLabel: true,
        },
        tooltip: {
          //   trigger: "axis",
          show: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {}, //导出图片
            dataZoom: {}, //区域缩放
            magicType: {
              //动态图表的切换
              type: ['bar', 'line'],
            },
          },
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          value: 'value',
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: 'white',
              rotate: 0,
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)

      this.updateChart()
    },

    getTotalEle() {
      let sum = 0
      for(let i= 0; i < this.valueArr.length; i++){
        sum += this.valueArr[i]
      }
      this.$store.commit('changeMonthEle', sum)
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
      const titleFontSzie = (this.$refs.dayRef.offsetWidth / 100) * 3.6

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

<style lang="less" scoped></style>
