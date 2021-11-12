<template>
  <div id="middleTop">
    <div class="bg-color-black" ref="devRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Dev',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      //设备参数数据
      devData: [
        {
          name: '电流',
          value: 90,
          max: 230,
          unit: 'A',
        },
        {
          name: '电压',
          value: 220,
          max: 280,
          unit: 'V',
        },
        {
          name: '压力',
          value: 3,
          max: 4,
          unit: 'bar',
        },
        {
          name: '液位',
          value: 10,
          max: 300,
          unit: 'ml',
        },
        {
          name: '氢气浓度',
          value: 80,
          max: 90,
          unit: 'mg/m3',
        },
      ],
      //当前液位
      liq: 10,
      // 定时器标识
      timerId: null,
      // 圆环坐标
      centerArr: [
        ['10%', '60%'],
        ['30%', '60%'],
        ['50%', '60%'],
        ['70%', '60%'],
        ['90%', '60%'],
      ],
      // 圆环渐变色
      colorArr: [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ],
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
    randomData() {
      this.devData[0].value = (Math.random() * 50 + 90).toFixed(2) //电流
      //this.devData[1].value = (Math.random() * 50 + 90).toFixed(2)//电压不用随动
      this.devData[2].value = (Math.random() * 3 + 1).toFixed(2) //压力
      this.devData[3].value = this.liq
      this.devData[4].value = (Math.random() * 20 + 70).toFixed(2) //氢气浓度
    },
    liqChange() {
      //液位,当没有满时，每秒递增10
      if (this.liq < 300) {
        this.liq += Math.round(Math.random() * 10 + 2)
      } else {
        this.liq = 10
      }
    },
    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.devRef, this.theme)
      const initOption = {
        backgroundColor:'rgba(0,0,0,0)',
        // title: {
        //   text: '▎设备状态',
        //   left: 20,
        //   top: 20,
        // },
      }
      this.chartInstance.setOption(initOption)
      this.startInterval()
    },

    // 发送请求，获取数据
    getData() {},
    // 更新图表配置项
    updateChart() {
      this.liqChange()
      this.randomData()
      let showData = this.devData
      let seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 设置成圆环图，外圆半径，内圆半径 在响应式处指定
          // radius: [120, 100],
          // 饼图的位置
          center: this.centerArr[index],
          // 关闭鼠标移入到饼图的动画效果
          hoverAnimation: false,
          // 隐藏指示线条
          labelLine: {
            show: false,
          },
          label: {
            position: 'center',
            color: this.colorArr[index][0],
          },
          detail: {
            valueAnimation: true,
            // width: '60%',
            // lineHeight: 40,
            // borderRadius: 8,
            // offsetCenter: [0, '-15%'],
            // fontSize: 60,
            // fontWeight: 'bolder',
            // formatter: '{value} °C',
            // color: 'auto',
          },
          data: [
            {
              name: item.name + '\n\n' + item.value + item.unit,
              value: item.value,
              itemStyle: {
                // 创建线性渐变的颜色 从下往上
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  // 0%
                  { offset: 0, color: this.colorArr[index][0] },
                  // 100%
                  { offset: 1, color: this.colorArr[index][1] },
                ]),
              },
              // 内部的提示框 c数值 d百分比
              tooltip: {
                formatter: `${item.name} <br/>value：{c}`, //<br/>占比：{d}%`,
              },
            },
            {
              value: item.max - item.value,
              itemStyle: {
                color: '#bbb',
              },
              // 内部的提示框
            },
          ],
        }
      })
      const dataOption = {
        animation: false,
        tooltip: {
          // 这里为item 可以为内部的数据开启 单独的 tooltip
          trigger: 'item',
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
      //   this.chartInstance.setOption(adapterOption)
      //   this.chartInstance.resize()
    },
    // 定时器不断切换当前页数
    startInterval() {
      this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        // 在更新完数据后，需要更新页面
        this.updateChart()
      }, 1000)
    },

    //屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.devRef.offsetWidth / 100) * 3.6
      console.log('titleFontSize: ', titleFontSize)
      // 圆的内院半径和 外圆半径
      const innerRadius = titleFontSize * 1.8
      const outerRadius = innerRadius * 1.2

      console.log('outerRadius: ', outerRadius)

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5,
            },
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5,
            },
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5,
            },
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5,
            },
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.8,
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
$box-height: 210px;
#middleTop{
      padding: 16px;
  height: $box-height;
  border-radius: 5px;
    .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
}
</style>