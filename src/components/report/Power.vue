<template>
  <div id="middleBottomLeft">
    <div class="bg-color-black" ref="powerRef"></div>
  </div>
</template>
<script>
/*
存在的问题：
开始时间应该为now之前的60秒
开始第一个数据，有一个无法显示
legend 无法自适应屏幕
*/
import { mapState } from 'vuex'

export default {
  // 空气流量/氢气流量
  name: 'Power',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      //时间间隔
      intervalSecond: 1000,
      //开始时间
      startTime: Date.now(),
      //功率数据
      powerData: [],
      // 定时器，控制每秒刷新
      timerId: null,
    }
  },
  created() {},
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
    clearInterval(this.timerId)
  },
  methods: {
    //随机数产生
    randomData(flo, range) {
      this.startTime = new Date(+this.startTime + this.intervalSecond)
      let value = Math.random() * range + flo
      return {
        name: this.startTime.toString(),
        value: [
          [this.startTime.getFullYear(), this.checkTime(this.startTime.getMonth() + 1), this.checkTime(this.startTime.getDate())].join('/') +
            ' ' +
            [this.checkTime(this.startTime.getHours()), this.checkTime(this.startTime.getMinutes()), this.checkTime(this.startTime.getSeconds())].join(':'),
          Math.round(value),
        ],
      }
    },
    //当date.getXXX会获取个位数例如:0,1,...,
    //但是Time轴的时间戳要求为YYYY/mm/dd hh:MM:ss所有要将 0,1,2...这些数换成 01,02,03...
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },

    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.powerRef, this.theme)
      for (var i = 0; i < 60; i++) {
        this.powerData.push(this.randomData(25, 10))
      }
      const initOption = {
        backgroundColor:"",
        title: {
          text: '▎输出功率',
          left: 20,
          top: 20,
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '10%',
          bottom: '5%',
          // 把x轴和y轴纳入 grid
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          // formatter: function (params) {
          //   params = params[0]
          //   var date = new Date(params.name)
          //   return 'time' + ': ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '<br/>' + 'value: ' + params.value[1]
          // },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} kw',
          },
        },
        legend: {
          left: 'center',
          top: '18%',
        },
        series: [
          {
            name: '输出功率',
            type: 'line',
            stack: this.activeName,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // 0% 颜色
                {
                  offset: 0,
                  color: 'rgba(232, 130, 28, 0.5)',
                },
                // 100% 颜色
                {
                  offset: 1,
                  color: 'rgba(232, 130, 28, 0)',
                },
              ]),
            },
            showSymbol: false,
            data: this.powerData,
            smooth: true,
            itemStyle: {
              normal: {
                color: '#E8821C',
              },
            },
            markLine: {
              data: [
                {
                  type: 'average',
                },
              ],
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      this.startInterval()
    },
    // 发送请求，获取数据
    getData() {
      // 开始自动切换
      //this.startInterval()
    },
    // 更新图表配置项
    updateChart() {
      this.powerData.shift()
      this.powerData.push(this.randomData(25, 10))
      const dataOption = {
        series: [
          {
            data: this.powerData,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    // 根据图标容器的宽度 计算各属性、标签、元素的大小
    screenAdapter() {
      const titleFontSzie = (this.$refs.powerRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSzie,
          },
        },
        legend: {
          // itemWidth: this.titleFontSize,
          // itemHeight: this.titleFontSize,
          // // 间距
          // itemGap: this.titleFontSize,
          // textStyle: {
          //   fontSize: this.titleFontSize / 1.3,
          // },
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      // 如果存在则关闭
      this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        this.updateChart()
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
$box-height: 300px;
#middleBottomLeft {
        padding: 16px;
  height: $box-height;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
}
</style>
