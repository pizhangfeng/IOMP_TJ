<template>
  <div id="rightCenter">
    <div class="bg-color-black" ref="envRef"></div>
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
  name: 'Env',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 定时器，控制每秒刷新
      timerId: null,
      //每日用电量
      eleConsumption: 0,
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
    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.envRef, this.theme)
      var initOption = {
        backgroundColor:"",
        title: {
          text: '▎环境监测',
          left: 20,
          top: 20,
        },
        backgroundColor: '#1b1b1b',
        tooltip: {
          formatter: '{a} <br/>{c} {b}',
        },
        series: [
          {
            name: '电表',
            type: 'gauge',
            min: 0,
            max: 8,
            splitNumber: 8,
            radius: '70%',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.09, 'lime'],
                  [0.82, '#1e90ff'],
                  [1, '#ff4500'],
                ],
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
              },
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            pointer: {
              // 分隔线
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,
            },
            title: {
              offsetCenter: [0, '70%'],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 18,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
              offsetCenter: [0, '110%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff',
                fontSize: 25,
              },
              // formatter: function (value){
              //     return "今日用电量: " + value
              // }
            },
            data: [{ value: 0, name: '电表/kw*h' }],
          },
          {
            name: '温度',
            type: 'gauge',
            center: ['21%', '55%'], // 默认全局居中
            radius: '55%',
            min: 0,
            max: 40,
            endAngle: 45,
            splitNumber: 5,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.29, 'lime'],
                  [0.86, '#1e90ff'],
                  [1, '#ff4500'],
                ],
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
              },
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
            },
            axisTick: {
              // 坐标轴小标记
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            pointer: {
              width: 5,
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
            },
            title: {
              offsetCenter: [0, '60%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
            },
            detail: {
              //backgroundColor: 'rgba(30,144,255,0.8)',
              // borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,

              width: 60,
              height: 20,
              offsetCenter: [0, '90%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff',
                fontSize: 20,
              },
            },
            data: [{ value: 0, name: '温度/°C' }],
          },
          {
            name: '湿度表',
            type: 'gauge',
            center: ['79%', '55%'], // 默认全局居中
            radius: '55%',
            min: 0,
            max: 100,
            startAngle: 135,
            splitNumber: 5,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.29, 'lime'],
                  [0.86, '#1e90ff'],
                  [1, '#ff4500'],
                ],
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
            },
            axisTick: {
              // 坐标轴小标记
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            pointer: {
              width: 5,
              shadowColor: '#fff', //默认透明
              shadowBlur: 1,
            },
            title: {
              offsetCenter: [-10, '60%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 1,
              },
            },
            detail: {
              //backgroundColor: 'rgba(30,144,255,0.8)',
              // borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,
              width: 80,
              height: 30,
              offsetCenter: [-10, '90%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff',
                fontSize: 20,
              },
            },
            data: [{ value: 0, name: '湿度/%' }],
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

    increaseEletricityConsumption() {
      this.eleConsumption += Math.random() * 0.003
    },
    // 更新图表配置项
    updateChart() {
      this.increaseEletricityConsumption()
      var updateOption = {
        series: [
          {
            data: [{ value: this.eleConsumption.toFixed(3), name: '用电量/kw*h' }],
          },
          {
            data: [{ value: (Math.random() * 1 + 31).toFixed(2), name: '温度/°C' }],
          },
          {
            data: [{ value: (Math.random() * 5 + 83).toFixed(2), name: '湿度/%' }],
          },
        ],
      }
      this.chartInstance.setOption(updateOption)
    },
    // 根据图标容器的宽度 计算各属性、标签、元素的大小
    screenAdapter() {
      const titleFontSzie = (this.$refs.envRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSzie,
          },
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
      }, 2000)
    },
  },
}
</script>

<style lang="scss" scoped>
$box-height: 300px;
#rightCenter {
    padding: 16px;
  height: $box-height;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
}
</style>
