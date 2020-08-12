<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getUserList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletUser(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
      </el-pagination>
    </el-card>

    <!--用户添加-->
    <el-dialog title="新增用户" :visible.sync="addDialogFormVisible" width="50%" @close="aadDialogClose"
               :close-on-click-modal="false">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRule" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--用户修改-->
    <el-dialog title="修改用户" :visible.sync="editDialogFormVisible" width="50%" @close="editDialogClose"
               :close-on-click-modal="false">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRule" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      pageTotal: 0,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      addForm: {},
      editForm: {},
      addFormRule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editFormRule: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList();
  },
  methods: {
    // 获取列表数据
    async getUserList () {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (result.meta.status == 200) {
        this.userlist = result.data.users;
        this.pageTotal = result.data.total;
      } else {
        this.$message.error('获取用户数据失败!')
      }
    },
    handleSizeChange (pagesize) {
      console.log(pagesize)
      this.queryInfo.pagesize = pagesize;
      this.getUserList();
    },
    handleCurrentChange (currentPage) {
      console.log(currentPage)
      this.queryInfo.pagenum = currentPage;
      this.getUserList();
    },
    // 添加弹窗关闭事件监听
    aadDialogClose () {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields();
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: result } = await this.$http.post('users', this.addForm)
          if (result.meta.status == 201) {
            this.addDialogFormVisible = false;
            this.getUserList();
          } else {
            this.$message.error('添加用户失败!');
          }
        }
      });
    },
    async showEditDialog (id) {
      const { data: result } = await this.$http.get('users/' + id);
      console.log(result)
      if (result.meta.status == 200) {
        this.editForm = result.data;
        this.editDialogFormVisible = true;
      } else {
        this.$message.error('获取用户失败!');
      }
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: result } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (result.meta.status == 200) {
            this.$message.success('修改用户成功')
            this.editDialogFormVisible = false;
            this.getUserList();
          } else {
            this.$message.error('修改用户失败!');
          }
        }
      })
    },
    async deletUser (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      console.log(confirmResult)
      if (confirmResult == 'confirm') {
        const { data: result } = await this.$http.delete('users/' + id);
        console.log(result)
        if (result.meta.status == 200) {
          this.$message.success('删除用户成功!')
          this.getUserList();
        } else {
          this.$message.error('删除用户失败!')
        }
      }
    },
    // 修改用户状态
    async userStateChanged (userInfo) {
      const { data: result } = await this.$http.put('users/' + userInfo.id + '/state/' + userInfo.mg_state)
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    }
  }
}
</script>
<style lang="less" scoped></style>
