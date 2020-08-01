<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form :rules="formRules" ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetForm () {
      this.$refs.loginFormRef.resetFields();
    },
    loginSubmit () {
      this.$refs.loginFormRef.validate(async validate => {
        if (validate) {
          const { data: result } = await this.$http.post('/login', this.loginForm);

          if (result.meta.status == 200) {
            this.$message({ showClose: true, message: '登录成功!', type: 'success' })
            // 把token存放到sessionStorage
            window.sessionStorage.setItem('token', result.data.token)
            // 登录成功跳转到home页面
            this.$router.push('/home')
          } else {
            this.$message({ showClose: true, message: '登录失败!', type: 'error' })
          }
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;

  .login-box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
