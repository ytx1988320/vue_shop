<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSettingRoleDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限-->
    <el-dialog title="分配权限" :visible.sync="settingRoleDialogVisible" width="50%" @close="settingRoleDialogClose"
               :close-on-click-modal="false">
      <el-tree :props="treeProps" :data="rightsList" node-key="id" ref="rightsTreeRef"
               show-checkbox default-expand-all :default-checked-keys="defKeys">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      settingRoleDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      selectRights: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: result } = await this.$http.get('roles');
      if (result.meta.status == 200) {
        this.rolesList = result.data;
      } else {
        this.$message.error('获取数据失败!')
      }
    },
    settingRoleDialogClose () {
      this.defKeys = [];
    },
    // 打开权限设置窗口
    async showSettingRoleDialog (role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.settingRoleDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async addRights () {
      this.selectRights = [...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
        ...this.$refs.rightsTreeRef.getCheckedKeys()]
      let idStr = this.selectRights.join(',')
      const { data: res } = await this.$http.post(
          `roles/${this.roleId}/rights`,
          { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.settingRoleDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>

</style>
