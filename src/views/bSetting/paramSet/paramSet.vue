<style lang="less" scoped>

</style>
<template>
    <div>
        <Row> 
        <!-- <Input v-model="searchDate.username" placeholder="登录账号查询" style="width: 160px"/>
        <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button> -->
        <!-- <Button @click="addbt" type="info" style="margin-left:30px;">新增</Button> -->
<Modal v-model="mod.add" title="设置" width="460">
    <Form ref="formValidate" :model="formValidate">
      <FormItem prop="value1">
          <span v-if="dt.type==0">新用户赠送童乐币数量</span>
          <span v-if="dt.type==1">故障申报奖励的童乐币数量</span>
          <span v-if="dt.type==2">月卡购买金额</span>
           <Input v-model="formValidate.value1" number style="width:80px;"></Input>
           <span v-if="dt.type==2">元</span>
      </FormItem>
      <FormItem prop="value2" v-if="dt.type==2">
          <span>每天使用数上限</span><Input v-model="formValidate.value2" number  style="width:80px;"></Input> 次
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrSetfn">确定</Button>
    </div>
</Modal>
<Modal v-model="mod.con" title="设置" width="900" :styles="{top: '20px'}">
    <Form ref="formValidate" :model="formValidate">
      <FormItem prop="content">
        <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrTxtfn">确定</Button>
    </div>
</Modal>
        </Row>
        <Row class="margin-top-10 tab minW"> 
            <Table :loading="tabload" size="small" stripe border :columns="columns" :data="dts" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="taRit"></Page>
     </div> 
</template> 
<script>
import tinymce from 'tinymce';
import util from "@/libs/util";
export default {
  data() {
    return {  
      is_disabled:0,
      curId:0, 
      tabload:true,
      total: 0,
      size: 12,
      page: 1, 
      columns: [
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "功能",
          key: "title"
        },
        {
          title: "设置值",
          render: (h, params) => {
            let val=params.row.value1;
            if(params.row.type==2){
              val='月卡金额 '+val+' 元，每天使用数上限 '+params.row.value2+' 次'
            }
            if(params.row.type==3){
              val='---';
            }
            return h("div",[h("span",val)]);
          }
        },
        {
          title: "最后更新时间",
          key: "createdon"
        }, 
        {
          title: "操作",
          width:220,
          render: (h, params) => {
            return h("div",[
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.dt=params.row;
                      if(params.row.type==3){
                        this.$refs['formValidate'].resetFields();
                        //tinymce.get('tinymceEditer').setContent(params.row.content);
                        this.mod.con=true; 
                      }else{
                        this.formValidate=params.row;
                        this.addbt(); 
                      }
                    }
                  }
                },
                '设置'
              )
            ]);
          }
        }
      ], 
      formValidate: {
        value1:'',
        value2:'',
        content:''
      },
      dts: [],
      dt:{}, 
      mod: { add: false,con:false,unable:false,edit: false,role:false,showimg: false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self=this,param={
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
      } 
      util.ajaxY("package.ParamConfigList",param,function(d){
          if (d.code == 0) {
              self.dts = d.data.rows;
              self.total = d.data.total;
          }
      },self);
    },
 
    addbt(){
      this.$refs['formValidate'].resetFields();
      this.mod.add = true;
    },
    contrSetfn() {
      let self = this; 
      if(self.formValidate.value1=='' ||(self.formValidate.value2==''&&self.dt.type==2)){
        self.$Message.error('填写完整信息');
        return false; 
      }
      self.formValidate.pcid=self.dt.pcid;
      util.ajaxY(
            "package.UpdateParamConfig",
            self.formValidate,
            function(d) {
              if (d.code == 0) {
                self.mod.add = false;
                self.$Message.info('成功');
                self.getData();
              }
            },
            self
          );
    },
    contrTxtfn() {
      let self = this;
      self.formValidate.content=tinymce.get('tinymceEditer').getContent({format: 'raw'});
      if(self.formValidate.content==''){
        self.$Message.error('填写完整信息');
        return false; 
      }
      self.formValidate.pcid=self.dt.pcid;
      util.ajaxY(
            "package.UpdateParamConfig",
            self.formValidate,
            function(d) {
              if (d.code == 0) {
                self.mod.con = false;
                self.getData();
              }
            },
            self
          );
    },
    getContent() {
      tinymce.get('tinymceEditer').getContent({format: 'raw'});
    },
    handleView(url) {
      this.imgUrl = url;
      this.mod.showimg = true;
    },
    changePage(pageIndex) {
      this.page = pageIndex;
      this.getData();
    }
  },
  mounted () {
      let self=this;
        this.$nextTick(() => {
            let vm = this;
            var height = document.body.offsetHeight - 450;
            tinymce.init({
                selector: '#tinymceEditer',
                branding: false,
                elementpath: false,
                height: height,
                language: 'zh_CN.GB2312',
                menubar: 'edit insert view format table tools',
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                    'searchreplace visualblocks visualchars code fullpage',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                ],
                // toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                toolbar1: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect ",
                toolbar2: "forecolor backcolor | bullist numlist | outdent indent | removeformat | link unlink uploadimage | preview fullscreen ",
                autosave_interval: '20s',
                image_advtab: true,
                table_default_styles: {
                    width: '100%',
                    borderCollapse: 'collapse'
                },
                setup: function (editor) {
                    editor.on('init', function (e) {
                        vm.spinShow = false;
                        editor.setContent(self.dts[0].content);
                    });
                }
            });
        });
    },
    destroyed () {
        tinymce.get('tinymceEditer').destroy();
    }
};
</script>
