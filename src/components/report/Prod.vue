<template>
  <div id="leftTop">
    <div class="bg-color-black">
      <!-- 6个主要的数据 -->
      <div class="bottom-data">
        <br />
        <!--产品ID -->
        <div>
          <span class="text" style="text-align: left">当前检测产品编号：</span>
          <span class="prodID">TJ00{{ prodID }}</span>
        </div>
        <!-- 中间的4个参数 -->
        <div class="item-box mt-2" v-for="(item, index) in numberData" :key="index">
          <p class="text" style="text-align: center">
            {{ item.text }}
          </p>
          <div class="d-flex" v-if="index != 0">
            <dv-digital-flop class="dv-digital-flop" :config="item.number" />
          </div>
          <div class="d-flex" v-else>
            <dv-digital-flop class="dv-digital-flop" v-if="isOver" :config="item.number" />
          </div>
          <br>
        </div>
        <div>------------------------------------------------------------------------------------------</div>
        <br>
        <br>
        <!-- 检测结果 -->
        <div>
          <span class="text" style="text-align: left">检测结果:          </span>
          <span class="qualified" v-if="result == '合格' && isOver">{{ result }}</span>
          <span class="disqualified" v-if="result == '不合格' && isOver">{{ result }}</span>
        </div>
      </div>
    </div>
    <!-- 进度表盘 -->
  </div>
</template>

<script>
export default {
  name: 'Prod',
  data() {
    return {
      //检测流程
      //程序运行开始检测，显示TJ001产品的产品编号开始时间，30s后TJ001产品检测结束，显示TJ001的结束时间和检测结果
      //结束时间和检测结果显示10秒，之后清空上一个产品结束时间和检测结果，开始显示TJ002产品的编号和开始时间
      //begin -> show TJ001(ID,startTime) -> 30s -> show TJ001(ID,startTime,overTime, result)
      //-> unshow TJ001(overTime, result) show TJ002(ID,startTime)

      //当前检测产品ID
      prodID: 0,
      //判断当前产品是否检测结束
      isOver: false,
      //当前产品开始检测时间
      startTime: new Date(),

      //每次测试的结果
      result: null,
      //产品参数
      numberData: [
        {
          number: {
            number: [0, 0, 0],
            textAlign: 'right',
            content: '{nt}:{nt}:{nt}',
            style: {
              fontSize: 24,
            },
          },
          text: '结束时间',
        },

        {
          number: {
            number: [0, 0, 0],
            textAlign: 'right',
            content: '{nt}:{nt}:{nt}',
            style: {
              fontSize: 24,
            },
          },
          text: '开始时间: ',
        },

        {
          number: {
            number: [88],
            toFixed: 1,
            textAlign: 'right',
            content: '{nt} cm3',
            style: {
              fontSize: 24,
            },
          },
          text: '单节面积: ',
        },

        {
          number: {
            number: [10],
            textAlign: 'right',
            content: '{nt} 节',
            style: {
              fontSize: 24,
            },
          },
          text: '电堆节数: ',
        },
      ],
    }
  },
  computed: {},
  mounted() {
    this.run()
    // this.changeProgress()
  },
  methods: {
    getResult() {
      this.result = Math.random() < 0.8 ? '合格' : '不合格'
      if (this.result == '合格') {
        this.$store.commit('increaseProdQual')
      } else {
        this.$store.commit('increaseProdDisq')
      }
    },

    run() {
      this.changeStartTime()
      setTimeout(() => {
        this.changeOverTime()
      }, 30000)
    },
    //控制 ID和StartTime变化
    changeStartTime() {
      this.changeStartNum()
      setInterval(() => {
        this.changeStartNum()
      }, 40000)
    },
    //控制result和overtime变化
    changeOverTime() {
      this.changeOverNum()
      setInterval(() => {
        this.changeOverNum()
      }, 40000)
    },

    changeStartNum() {
      this.isOver = false
      this.prodID += 1
      this.startTime = new Date()
      this.numberData[1].number.number[0] = this.startTime.getHours()
      this.numberData[1].number.number[1] = this.startTime.getMinutes()
      this.numberData[1].number.number[2] = this.startTime.getSeconds()
      this.numberData[1].number = { ...this.numberData[1].number }
    },
    changeOverNum() {
      this.getResult()
      this.$store.commit('changeCurrProdResult', this.result)
      this.isOver = true
      this.$store.commit('changeOverTime')
      this.numberData[0].number.number[0] = this.$store.state.overTime.getHours()
      this.numberData[0].number.number[1] = this.$store.state.overTime.getMinutes()
      this.numberData[0].number.number[2] = this.$store.state.overTime.getSeconds()
      this.$EventBus.$emit('changeRecord')
      this.$EventBus.$emit('changePass')
      this.numberData[0].number = { ...this.numberData[0].number }
    },
  },
}
</script>

<style lang="scss" scoped>
$box-height: 340px;

#leftTop {
  padding: 16px;
  height: $box-height;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
    font-size: 24px;
  }

  .prodID {
    color: yellow;
    font-size: 25px;
  }
  .qualified {
    font-size: 32px;
    color: green;
  }
  .disqualified {
    font-size: 32px;
    color: red;
  }
  .dv-dec-3 {
    position: relative;
    width: 100px;
    height: 20px;
    top: -3px;
  }
  .cate-name {
    position: absolute;
    right: 20%;
    bottom: 50%;
    z-index: 999;
  }

  .bottom-data {
    .item-box {
      & > div {
        padding-right: 5px;
      }
      font-size: 18px;
      float: right;
      position: relative;
      left: 20px;
      top: 20px;
      width: 50%;
      color: #d3d6dd;
      .dv-digital-flop {
        width: 120px;
        height: 30px;
      }
      .colorYellow {
        color: yellowgreen;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
