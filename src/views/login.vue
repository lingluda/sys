<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <div class="tlogo">
                    <img src="/static/logo.jpg" height="100"/>
                    <p class="margin-top-10 fontS20">创崛石材管理内部登录</p>
                    <!-- 欢迎登录 -->
                </div>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="account">
                            <Input v-model="form.account" size="large" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" size="large" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                         <FormItem prop="password">
                            <Row>
                             <i-col span="16">
                            <Input size="large" v-model="form.sysLoginVerificationCode" placeholder="请输入验证码"></Input>
                              </i-col>
                            <i-col span="8">
                            <img :src="src" @click="srcChange()"> 
                            </i-col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button @click="handleSubmit" size="large" type="primary" :loading="tabload" long>登录</Button>
                        </FormItem>
                    </Form>
                    <!-- <p class="login-tip">深圳互联心科技有限公司 提供技术支持</p> -->
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import util from '@/libs/util.js';
export default {
  data() {
    return {
      form: { 
        account:"",
        password:"",
        sysLoginVerificationCode:""
      },
      tabload: false,
      src:"/common/verificationCode?codeType=sysLoginVerificationCode&r=",
      rules: {
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
 
  methods: {
    
     srcChange(){        
          this.src="/common/verificationCode?codeType=sysLoginVerificationCode&r="+Math.random();
      },
    handleSubmit() {
        //console.log("11111111111");
          this.srcChange();
    let self=this;
      //console.log(self.data.id);
      this.$refs.loginForm.validate(valid => {
       // console.log(valid);
                  //Cookies.set("user", self.form.account);
                //Cookies.set("password", self.form.password);
                //Cookies.set("usid", d.data.id);
                
                //self.$router.push({name: "home_index"});
        if (valid) {
         this.tabload = true;
          util.ajaxY(
            "/sys/sysUser/login",self.form,function(d) {
              if (d.code == 0) {
                Cookies.set("user", self.form.account);
                Cookies.set("username", d.data.name);
                Cookies.set("usid", d.data.id);
                self.$router.push({name: "home_index"});
              }
               
            },self
          );
         }
      });
    }
  }
};
</script>
