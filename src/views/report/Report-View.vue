<template>
  <div ref="main" id="main" style="height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts'
// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
export default {
  name: 'Report-View',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.getreport()
  },
  methods: {
    async getreport() {
      const myChart = echarts.init(this.$refs.main)
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error('数据获取失败')
      const result = _.merge(res.data, this.options)
      myChart.setOption(result)
    }
  }
}
</script>

<style lang="less" scoped>
#main {
  width: 100%;
}
</style>
