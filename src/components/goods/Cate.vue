<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class="cate-tree-table" :data="cateList" :columns="cateColumns" :show-index="true" index-text="#"
                  :border="true" :show-row-hover="false" :selection-type="false" :expand-type="false">
        <!--是否有用 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
          <i class="el-icon-close" v-else style="color: red;"></i>
        </template>
        <!-- 排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
      </tree-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      cateColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ]
    }
  },
  created () {
    this.getCateList();
  },
  methods: {
    async getCateList () {
      const { data: result } = await this.$http.get('categories', { params: this.queryInfo });
      if (result.meta.status == 200) {
        this.cateList = result.data.result;
        this.total = result.data.total;
      } else {
        this.$message.error('获取数据失败!')
      }
    },
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize;
      this.getCateList();
    },
    handleCurrentChange (curPage) {
      this.queryInfo.pagenum = curPage;
      this.getCateList();
    }
  }
}
</script>
<style lang="less" scoped>
.cate-tree-table {
  margin-top: 15px;
}
</style>
