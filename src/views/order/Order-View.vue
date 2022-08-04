<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFomat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showPlaceDiag"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showprogBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改位置 -->
    <el-dialog
      title="修改地址"
      :visible.sync="placedialogVisible"
      width="50%"
      @close="placedialogClose"
    >
      <el-form
        :model="editPlaceForm"
        :rules="editPlaceFormrules"
        ref="editPlaceFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区" prop="address1">
          <el-cascader
            v-model="editPlaceForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editPlaceForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="placedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="placedialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="物流信息" :visible.sync="progdialogVisible" width="50%">
      <!-- <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline> -->
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  name: 'Order-View',
  data() {
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      // 订单列表
      orderList: [],
      // 修改位置的弹窗
      placedialogVisible: false,
      editPlaceForm: {
        address1: [],
        address2: ''
      },
      editPlaceFormrules: {
        address1: [{ required: true, message: '请输入', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      citydata: citydata,
      // 物流信息
      progdialogVisible: false,
      progFrom: {}
    }
  },
  created() {
    this.getorderList()
  },
  methods: {
    async getorderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
      // console.log(this.orderList)
    },
    // 分页pagesize改变事件
    handleSizeChange(val) {
      // console.log(val)
      this.queryInfo.pagesize = val
      this.getorderList()
    },
    // 分页pagenum改变事件
    handleCurrentChange(val) {
      // console.log(val)
      this.queryInfo.pagenum = val
      this.getorderList()
    },
    showPlaceDiag() {
      this.placedialogVisible = true
    },
    placedialogClose() {
      this.$refs.editPlaceFormRef.resetFields()
    },
    // 物流信息
    async showprogBox() {
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) return this.$message.error('获取物流失败')
      // this.progFrom = res.data
      // console.log(this.progFrom)
      this.progdialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
