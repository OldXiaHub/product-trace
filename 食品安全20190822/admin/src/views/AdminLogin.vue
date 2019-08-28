  <template>
  <div class="main" style="text-align:center">
    <div class="login">
      <el-form :label-position="labelPosition" label-width="70px" :model="formLabelAlign">
        <h2>登录</h2>
        <div class="txt">
          <el-form-item label="用户名:">
            <el-input placeholder="请输入用户名" v-model="formLabelAlign.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码:">
            <el-input placeholder="请输入密码" v-model="formLabelAlign.password" show-password clearable></el-input>
          </el-form-item>
        </div >
        <div class="code-box">
          <el-form-item label="验证码:" style="text-align:center">
            <el-input v-model="yanzhengma" placeholder="请输入验证码" clearable></el-input>
          </el-form-item>
          <span class="code-style" @click="createCode">{{verificationCode}}</span>
        </div>
        <el-button type="primary" @click="confirmTheCode();login()" style="width:300px ;">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      verificationCode: "",
       yanzhengma: "",
      labelPosition: "right",
      userInfoList:"",
      formLabelAlign: {
        name: "",
        password: ""
      }
    };
  },
  created(){
    this.createCode();
  },
  methods: {
    login() {
      if (this.formLabelAlign.name == "" || this.formLabelAlign.password == "") {
                  this.$alert("用户名或密码不能为空");
            }else if(this.yanzhengma==""){
                    
            } else {

      var self = this;
      this.$axios({
        method: "POST",
        url: "http://10.96.116.248:80/api/adminlogin",
        params:{
          adminName: self.formLabelAlign.name,
          adminPassword: self.formLabelAlign.password,
        }
      })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
              this.userInfoList=result.data
              
            //   if(this.userInfoList.adminStatus==1){
            //         this.$router.push({
            //   name: "adminhome"
            // });
            //   }else{
            //         this.$router.push({
            //   name: "factoryhome"
            // });
            //   }
            this.$router.push({
              name: "factory"
            })
          }else{
            alert(result.message)
          }
        })
        .catch(error => {
          alert(error);
        });
    }},
    createCode: function() {
      //通过随机数生成验证码
      this.verificationCode = "";
      var code = "";
      var codeLength = 4; //验证码长度
      var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      );
      for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random() * 36);
        code += random[index];
      }
      this.verificationCode = code;
    },
    // /*把小写验证码转换成大写*/
   
    confirmTheCode:function () {      //验证函数
            var customerCode = this.yanzhengma.toUpperCase();   //把你输入的小写转化为大写
            if(customerCode == 0){
                this.createCode();
                this.yanzhengma = ''
                alert('请输入验证码')
            }else if(customerCode != this.verificationCode){
                this.createCode();
                this.yanzhengma = '';
                alert('验证码不正确，请重新输入');
            }else {
                
            }
        }, 
  }
};
</script>
<style >
.main {
  position: absolute;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-image: url(../assets/timg.jpg);
}
.login {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background: #ffffff
}
.main .txt {
  margin: 0 auto;
}
.main .login .el-input {
  width: 280px;
}
.code-style{
        font-size:25px;
        color:black;
        cursor: pointer; 
        background-image: url('../assets/yzbg1.jpg')
    }
    .code-box{
      text-align: center;
    }
    .zhanghudenglu{
      text-align: center;
      font-weight: bolder;
      color: red;
      line-height: 55px;
    }
</style>
