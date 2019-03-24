<style scoped lang="less">
    .home-main{
        width: 100%;
        position: absolute;
        background-color: #fff;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;

        p{
            color: #666;
            font-size: 24px;
        }
        .ivu-row-flex{
            height: 100%;
        }
    }
</style>
<template>

        <div class="home-main">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
            <img src="/static/logo.png" height="120"/>
               <p style="padding-top:18px;">创崛石材系统</p>
            </Col>
        </Row>
    </div>

</template>

<script>
import Cookies from 'js-cookie';
export default {
    data() {
        return{
          logoUrl: require('./../../images/llogo.png'),
        }
    },
    created () {
        //this.getUserId();
    },
    methods: {
      getUserId () {
        this.$ajax
          .post("/web/user/getuserinfo")
          .then((response) => {
            let d = response.data;
            if (d.code == 1) {
              Cookies.set("userId", d.data.userId);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  }
</script>
