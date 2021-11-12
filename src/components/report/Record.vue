<template>
  <div id="leftCenter">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <div class="d-flex">
          <span class="fs-xl text mx-2">检测记录</span>
        </div>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board class="dv-scr-board" ref="dv-scr-board" :config="config" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Record',
  data() {
    return {
      qualCount: 0,
      disqCount: 0,
      recordData: [],
      result: null,
      exceptionArry: ['电堆温度过高', '低于警告电压', '高于警告电压', '恒电压功率过低', '恒电压功率过高', '电导率过高', '电导率过低'],
      config: {
        header: ['产品编号', '检测结果', '结束时间', '异常原因'],
        data: this.recordData,
        rowNum: 7, //表格行数
        headerHeight: 35,
        headerBGC: '#0f1325', //表头
        oddRowBGC: '#0f1325', //奇数行
        evenRowBGC: '#171c33', //偶数行
        index: true,
        columnWidth: [50, 80, 80, 160],
        align: ['center'],
      },
    }
  },
  components: {},

  mounted() {
    this.$EventBus.$on('changeRecord', () => {
      this.updateRow()
    })
  },
  methods: {
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    getOverTime() {
      return (
        this.$store.state.overTime.getFullYear() +
        '/' +
        this.checkTime(this.$store.state.overTime.getMonth() + 1) +
        '/' +
        this.checkTime(this.$store.state.overTime.getDate()) +
        '/' +
        ' ' +
        this.checkTime(this.$store.state.overTime.getHours()) +
        ':' +
        this.checkTime(this.$store.state.overTime.getMinutes()) +
        ':' +
        this.checkTime(this.$store.state.overTime.getSeconds())
      )
    },
    getProdID() {
      return 'TJ00' + (this.$store.state.prodQual + this.$store.state.prodDisq)
    },
    judgeResult() {
      if (this.qualCount != this.$store.state.prodQual) {
        this.qualCount = this.$store.state.prodQual
        this.result = '合格'
      } else if (this.disqCount != this.$store.state.prodDisq) {
        this.disqCount = this.$store.state.prodDisq
        this.result = '不合格'
      }
    },
    getResult() {
      //当store中合格个数的值与该组件中的合格个数值不同表示当前产品是合格的
      //可以使用 store中的result
      if (this.result == '合格') {
        return "<span class='colorGrass'>合格</span>"
      } else if (this.result == '不合格') {
        return "<span  class='colorRed'>不合格</span>"
      }
    },
    getException() {
      if (this.result == '合格') {
        return '无'
      } else if (this.result == '不合格') {
        return this.exceptionArry[Math.round(Math.random() * 6)]
      }
    },
    getData() {
      let prodId = this.getProdID()
      let overTime = this.getOverTime()
      let result = this.getResult()
      let exception = this.getException()
      this.data.push([prodId, overTime, result, exception])
    },
    updateRow() {
      // console.log(this.getProdID());
      // console.log(this.getOverTime());
      // console.log(this.getResult());
      // console.log(this.getException());
      this.judgeResult()
      this.recordData.push([this.getProdID(), this.getResult(), this.getOverTime(), this.getException()])
      console.log(this.recordData)
      this.$refs['dv-scr-board'].updateRows(this.recordData)
    },
  },
}
</script>

<style lang="scss" scoped>
$box-height: 300px;
#leftCenter {
  padding: 10px;
  height: $box-height;
  border-radius: 10px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
    font-size: 20px;
  }
  .body-box {
    border-radius: 10px;
    overflow: hidden;
    .dv-scr-board {
      width: 500px;
      height: 250px;
    }
  }
  .colorGrass {
    color: green;
  }
}
</style>

<style lang="scss">
.colorGrass {
  color: #33cea0;

  &:hover {
    color: #33cea0 !important;
  }
}
.colorRed {
  color: #ff5722;

  &:hover {
    color: #ff5722 !important;
  }
}
</style>
