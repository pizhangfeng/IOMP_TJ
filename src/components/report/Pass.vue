<template>
  <div id="rightTop">
    <div class="bg-color-black" ref="passRef">
    </div>
            <!-- 右边的数据 -->
    <span class="cate-name">
      <div>
        <!-- <span class="text" :style="themeStyle">合格产品 :</span> -->
        <dv-digital-flop class="dv-digital-flop" :config="qualCount" />
      </div>
      <div>
        <!-- <span class="text" :style="themeStyle">不合格产品 :</span> -->
        <dv-digital-flop class="dv-digital-flop" :config="disqCount" />
      </div>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from 'utils/theme_utils'
import _ from 'lodash'

export default {
  name: 'Pass',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 字体响应式大小
      titleFontSize: null,
      //合格率数据
      passData: [
        {
          name: '合格',
          value: 0,
        },
        {
          name: '不合格',
          value: 0,
        },
      ],
      qualCount: {
        number: [0],
        textAlign: 'right',
        content: '合格产品: {nt}',
        style: {
          fontSize: 24,
        },
      },
      disqCount: {
        number: [0],
        textAlign: 'right',
        content: '不合格产品: {nt}',
        style: {
          fontSize: 24,
        },
      },
    }
  },

  created() {
    // this.$socket.registerCallBack('passData', this.getData)
  },
  computed: {
    ...mapState(['theme']),
    cateName() {
      return '合格率'
    },
    themeStyle() {
      if (!this.titleFontSize) {
        return { color: getThemeValue(this.theme).titleColor }
      }
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
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
    this.$EventBus.$on('changePass', () => {
      this.updateChart()
      this.changeProdNum()
    })
    this.initChart()
    // this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'passData',
    //   chartName: 'pass',
    //   value: '',
    // })
    window.addEventListener('resize', this.screenAdapter)
    // 主动触发 响应式配置
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('passData')
  },
  methods: {
    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.passRef, this.theme)

      const initOption = {
        backgroundColor:"",
        title: {
          text: '▎产品合格率',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          top: '15%',
          // 图标类型 圆形
          icon: 'circle',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              formatter: `{b}率: {d}%`,
            },
            color: ['#6FE698', '#FF6F7F'],
            labelLine: {
              show: false,
            },
            // 高亮状态下的样式
            // emphasis: {
            //   labelLine: {
            //     // 连接文字的线条
            //     show: false,
            //   },
            // },
          },
        ],
        immediate: true,
        deep: true,
      }
      this.chartInstance.setOption(initOption)
    },

    // 发送请求，获取数据
    getData() {
      // const { data: res } = await this.$http.get('/hotproduct')
      // this.allData = res
      // this.updateChart()
    },
    changeProdNum() {
      this.qualCount.number[0] = this.$store.state.prodQual
      this.disqCount.number[0] = this.$store.state.prodDisq
      this.qualCount = { ...this.qualCount }
      this.disqCount = { ...this.disqCount }
    },
    // 更新图表配置项
    updateChart() {
      // 处理数据
      const legendDateArr = this.passData.map(item => item.name)
      this.passData[0].value = this.$store.state.prodQual
      this.passData[1].value = this.$store.state.prodDisq
      const dataOption = {
        legend: {
          data: legendDateArr,
        },
        series: [
          {
            data: this.passData,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    // 不同分辨率的响应式
    screenAdapter() {
      this.titleFontSize = (this.$refs.passRef.offsetWidth / 100) * 3.6
      console.log('titleFontSize: ', this.titleFontSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize * 0.8,
          itemHeight: this.titleFontSize * 0.8,
          // 图例的间隔
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize * 0.8,
          },
        },
        series: [
          {
            // 饼图的大小 半径
            radius: [this.titleFontSize * 2, this.titleFontSize * 4.5],
            // 控制饼图的位置 x,y
            center: ['50%', '60%'],
            label: {
              fontSize: this.titleFontSize * 1,
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
$box-height: 320px;
#rightTop {
  padding: 16px;
  height: $box-height;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
  i {
    z-index: 999;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    cursor: pointer;
  }
  i.icon-left {
    left: 10%;
  }
  i.icon-right {
    right: 10%;
  }
  .cate-name {
    position: absolute;
    right: 5%;
    bottom: 55%;
    z-index: 999;
  }
  .dv-digital-flop {
    width: 240px;
    height: 60px;
  }
  .text {
    color: #c3cbde;
    font-size: 18px;
  }
}
</style>