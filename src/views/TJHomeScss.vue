<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 class="dv-dec-10" />
          <div class="d-flex jc-center">
            <dv-decoration-8 class="dv-dec-8" :color="['#568aea', '#000000']" />
            <div class="title">
              <span class="title-text">智慧运维平台</span>
            </div>
            <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="['#568aea', '#000000']" />
          </div>
          <dv-decoration-10 class="dv-dec-10-s" />
        </div>

        <!-- 公司，时间 -->
        <div class="d-flex jc-between px-2">
          <div class="d-flex aside-width">
            <div class="react-left ml-4 react-l-s">
              <span class="react-before"></span>
              <span>
                <img :src="tjLogoSrc" class="text tjlog" />
                <span class="text tjname">广东泰极动力科技有限公司</span>
              </span>
            </div>
          </div>
          <div class="d-flex aside-width">
            <div class="react-right bg-color-blue mr-3">
              <span class="text fw-b">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
            </div>
            <div class="react-right mr-4 react-l-s">
              <span class="react-after"></span>
              <span>
                <img :src="ccccLogoSrc" class="text cccclogo" />
                <span class="text ccccname">中交机电局第三工程公司</span>
              </span>
            </div>
          </div>
        </div>

        <div class="body-box">
          <!-- 左边列 -->
          <div class="left-box">
            <div class="left-top">
              <dv-border-box-12>
                <Prod />
              </dv-border-box-12>
            </div>

            <div class="left-center">
              <dv-border-box-12>
                <Record />
              </dv-border-box-12>
            </div>

            <div class="left-bottom">
              <dv-border-box-12>
                <Camera />
              </dv-border-box-12>
            </div>
          </div>

          <!-- 中间列 -->
          <div class="middle-box">
            <div class="middle-top">
              <dv-border-box-11 title="设备状态">
                <Dev />
              </dv-border-box-11>
            </div>

            <div class="middle-center">
              <dv-border-box-8>
                <Air />
              </dv-border-box-8>
            </div>

            <div class="middle-bottom">
              <div class="middle-left">
                <dv-border-box-4 :color="['#32C5E9']">
                  <Power />
                </dv-border-box-4>
              </div>
              <div class="middle-right">
                <dv-border-box-4 :color="['#32C5E9']" :reverse="true">
                  <Elecon />
                </dv-border-box-4>
              </div>
            </div>
          </div>

          <!-- 第三列 -->
          <div class="right-box">
            <div class="right-top">
              <dv-border-box-12>
                <Pass />
              </dv-border-box-12>
            </div>
            <div class="right-center">
              <dv-border-box-12>
                <Env />
              </dv-border-box-12>
            </div>
            <div class="right-bottom">
              <dv-border-box-12>
                <Day3D />
              </dv-border-box-12>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from '../utils/drawMixin'
import { formatTime } from '../utils/index.js'

import Pass from '@/components/report/Pass.vue'
import Day from '@/components/report/Day.vue'
import Air from '@/components/report/Air.vue'
import Power from '@/components/report/Power.vue'
import Elecon from '@/components/report/Elecon.vue'
import Dev from '@/components/report/Dev.vue'
import Env from '@/components/report/Env.vue'
import Record from '@/components/report/Record.vue'
import Prod from '@/components/report/Prod.vue'
import Camera from '@/components/report/Camera.vue'
import Day3D from '@/components/report/Day3D.vue'

export default {
  mixins: [drawMixin],
  data() {
    return {
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    }
  },
  components: {
    Pass,
    Day,
    Air,
    Power,
    Elecon,
    Dev,
    Env,
    Record,
    Prod,
    Camera,
    Day3D,
  },
  computed: {
    tjLogoSrc() {
      return '/static/img/tjlogo.png'
    },
    ccccLogoSrc() {
      return '/static/img/cccclogo.jpg'
    },
  },
  mounted() {
    this.timeFn()
    this.cancelLoading()
  },
  unMounted() {
    clearInterval(this.timing)
  },
  methods: {
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), 'HH: mm: ss')
        this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 1000)
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
  },
}
</script>

<style lang="scss">
@import '../assets/scss/index.scss';
</style>
