<style lang="less" scoped>

</style>
<template>
    <div>
        <Row>
            <!--   <Input v-model="searchDate.account" placeholder="登录账号查询" style="width: 160px"/>
             <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
             <Button @click="canclefn" type="ghost" >取消</Button>
             <Button @click="addbt" type="info" style="margin-left:30px;">新增</Button>-->
            <Button @click="addbt" type="info" >新增</Button>
            <Modal v-model="mod.add" title="新增" width="460">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <FormItem label="推广账号：" prop="account">
                        <Input v-model="formValidate.account"></Input>
                    </FormItem>

                    <FormItem label="登录密码：" prop="password">
                        <Input type="password" v-model="formValidate.password"></Input>
                    </FormItem>
                    <FormItem label="确认登录密码：" prop="passwordCheck">
                        <Input type="password" v-model="formValidate.passwordCheck"></Input>
                    </FormItem>

                </Form>
                <div slot="footer">
                    <Button type="info" size="large"  @click="contrAddfn">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.del" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>提示</span>
                </p>
                <div style="text-align:center">
                    <p>确定要删除？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteFn()">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.edit" title="编辑" width="460">
                <Form ref="formEdit" :model="formEdit" :rules="ruleEditdate" :label-width="120">
                    <FormItem label="登录账号：" prop="account">
                        <Input v-model="formEdit.account"></Input>
                    </FormItem>

                    <FormItem label="登录密码：" prop="password">
                        <Input type="password" v-model="formEdit.password"></Input>
                    </FormItem>
                    <FormItem label="确认登录密码：" prop="passwordCheck">
                        <Input type="password" v-model="formEdit.passwordCheck"></Input>
                    </FormItem>

                    <FormItem label="状态">
                        <Select v-model="status">
                            <Option v-for="(item,index) in zt" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large"  @click="contrEditfn">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.role" title="配置角色" width="380">
                <Form :label-width="86">
                    <FormItem label="分配角色：">
                        <Select v-model="selRole">
                            <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large"  @click="contrRolefn">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.unable" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>{{status?'禁用':'启用'}}</span>
                </p>
                <div v-if="status" style="text-align:center">
                    <p>确定要禁用当前用户？</p>
                    <p>禁用之后，该用户无法登录管理后台</p>
                </div>
                <div v-else style="text-align:center">
                    <p>确定要启用当前用户？</p>
                    <p>启用之后，该用户便可以登录管理后台.</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="unablefn">确定</Button>
                </div>
            </Modal>
            <Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
                <img :src="imgUrl" class="fulWidth">
            </Modal>
        </Row>
        <Row class="margin-top-10 tab minW">
            <Table :loading="tabload" size="small" stripe border :columns="columns" :data="dts" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="taRit"></Page>
    </div>
</template>
<script>
    import util from "@/libs/util";
    import Cookies from 'js-cookie';
    export default {
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码!'));
                }
                else if (value !== this.formValidate.password) {
                    callback(new Error('两次密码不一致!'));
                } else {
                    callback();
                }
            };
            const editdatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    //callback(new Error('请输入确认密码!'));
                }
                else if (value !== this.formEdit.password) {
                    callback(new Error('两次密码不一致!'));
                } else {
                    callback();
                }
            };
            const mobileCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号码!'));
                } else if (!/^1[0-9]{10}$/.test(value)) {
                    callback(new Error('请输入正确的手机号码!'));
                } else {
                    callback();
                }
            };
            return {
                zt: [{
                    value: '1',
                    label: '禁用'
                },
                    {
                        value: '0',
                        label: '启用'
                    }
                ],
                status:'',
                imgUrl: "",
                curId:0,
                selRole:'',
                tabload:true,
                total: 0,
                size: 12,
                page: 1,
                searchDate: {
                    account: ""
                },
                columns: [
                    {
                        title: "序号",
                        type: "index",
                        width: 90,
                        align: "center"
                    },
                    {
                        title: "推广账号",
                        key: "account"
                    },

                    {
                        title: "创建时间",
                        key: "gmtCreate"
                    },
                    {
                        title: "更新时间",
                        key: "gmtModified"
                    },
                    {
                        title: "状态",
                        key:"status",
                        render: (h, params) => {return h('div',['启用','禁用'][params.row.status] );}
                    },
                    {
                        title: "操作",
                        width:220,
                        render: (h, params) => {
                            return h("div",[
                                // h(
                                //   "Button",
                                //   {
                                //     props: {
                                //       size: "small"
                                //     },
                                //     style: {
                                //       marginRight: "5px"
                                //     },
                                //     on: {
                                //       click: () => {
                                //         if(this.roles.length<1){
                                //           this.getRoles();
                                //         }
                                //         this.curId=params.row.id;
                                //         this.selRole='';
                                //         this.mod.role = true;
                                //       }
                                //     }
                                //   },
                                //   "设置角色"
                                // ),
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
                                                this.getRoles();
                                                this.dt=params.row;
                                                this.formEdit={account:params.row.account,name:params.row.name,phone:params.row.phone,status:this.status};
                                                this.mod.edit = true;
                                            }
                                        }
                                    },
                                    "编辑"
                                ),
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
                                                this.curId = params.row.id;
                                                this.mod.del = true
                                            }
                                        }
                                    },
                                    "删除"
                                )
                                // h(
                                //   "Button",
                                //   {
                                //     props: {
                                //       size: "small"
                                //     },
                                //     style: {
                                //       marginRight: "5px"
                                //     },
                                //     on: {
                                //       click: () => {
                                //         this.status=params.row.status?0:1;
                                //         this.curId=params.row.id;
                                //         this.mod.unable = true;
                                //       }
                                //     }
                                //   },
                                //   params.row.status?'启用':'禁用'
                                // )
                            ]);
                        }
                    }
                ],
                formValidate: {
                    account:'',
                    name:'',
                    password:'',
                    passwordCheck:'',
                    phone:'',
                },
                ruleValidate: {
                    account: [
                        {
                            required: true,min:3,
                            message: "请输入登录账号并不少于3位"
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: "请输入姓名"
                        }
                    ],
                    password: [
                        {
                            required: true,min:6,
                            message: "请输入登录密码并不少于6位"
                        }
                    ],
                    passwordCheck: [
                        { validator: validatePassCheck,required: true, trigger: 'blur' }
                    ],
                    phone: [
                        { validator: mobileCheck, trigger: 'blur',required: true }
                    ]
                },
                formEdit: {
                    name:'',
                    phone:'',
                    account:'',
                    password:'',
                    passwordCheck:'',
                    status:''
                },
                ruleEditdate:  {
                    account: [
                        {
                            required: true, min:3,
                            message: "请输入登录账号并不少于3位"
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: "请输入姓名"
                        }
                    ],
                    password: [
                        {
                            required: false,min:6,
                            message: "请输入登录密码并不少于6位"
                        }
                    ],
                    passwordCheck: [
                        { validator: editdatePassCheck,required: false, trigger: 'blur' }
                    ],
                    phone: [
                        { validator: mobileCheck, trigger: 'blur',required: true }
                    ]
                },
                dts: [],
                dt:{},
                roles:[],
                mod: { add: false,unable:false,edit: false,role:false,showimg: false,del:false},
                loading: { add: true }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let self=this,param={
                    //id:Cookies.get('id'),
                    account: util.trim(self.searchDate.account),
                    pageIndex: this.page, //页码
                    pageSize: this.size //每页条数
                }
                util.ajaxY("/sys/employUser/spreadList",param,function(d){
                    if (d.code == 0) {
                        self.dts = d.data.rows;
                        console.log("1213213413:"+ d.data.rows);
                        self.total = d.data.total;
                    }
                },self);
            },
            addbt(){
                this.$refs['formValidate'].resetFields();
                this.mod.add = true;
            },
            contrAddfn() {
                let self = this,param={
                    //id:0,//新增
                    account:this.formValidate.account,
                    //name:this.formValidate.name,
                    password:this.formValidate.password,
                   // phone:this.formValidate.phone
                };
                this.$refs.formValidate.validate(valid => {
                    if (valid) {
                        util.ajaxY(
                            "/sys/employUser/insertSpread",
                            param,
                            function(d) {
                                if (d.code == 0) {
                                    self.mod.add = false;
                                    self.$Message.info('成功');
                                    self.getData();
                                }
                            },
                            self
                        );
                    }
                });
            },
            deleteFn(){
                let self=this
                util.ajaxY('/sys/employUser/delSpread',{id:this.curId},function(d){
                    console.log(d.code);
                    if (d.code==0) {
                        self.$Message.info(d.msg);
                        self.mod.del = false;
                        self.getData();
                    }
                },self)
            },
            contrEditfn(){
                let self = this,param={
                    id:this.dt.id,//编辑
                    account:this.formEdit.account,
                   // name:this.formEdit.name,
                    password:this.formEdit.password,
                   // phone:this.formEdit.phone,
                    status:this.status
                };
                this.$refs.formEdit.validate(valid => {
                    if (valid) {
                        util.ajaxY(
                            "/sys/employUser/updateSpread",
                            param,
                            function(d) {
                                if (d.code == 0) {
                                    self.mod.edit = false;
                                    self.$Message.info('成功');
                                    self.getData();
                                }
                            },
                            self
                        );
                    }
                });
            },
            getRoles(){
                let self=this;
                util.ajaxY("/sys/sysRole/list",{ pageIndex: 1,pageSize: 999},function(d) {
                        if (d.code == 0) {
                            self.roles=d.data.rows;
                        }
                    },
                    self
                );
            },
            contrRolefn(id){
                console.log("wqrdas:"+id)
                let self=this;
                // if(self.selRole =='') {
                //     self.$Message.error('请选择角色！');
                //     return false;
                // }
                util.ajaxY("/sys/sysUserRole/insert",{sysUserId:id,sysRoleId:this.selRole},function(d) {
                        if (d.code == 0) {
                            self.$Message.info('成功');
                            self.getData();
                            self.mod.role=false;
                        }
                    },
                    self
                );
            },
            unablefn(){
                let self=this,param={
                    id:this.curId,
                    status:this.status
                };
                util.ajaxY("/sys/sysUser/sysUserStatus",param,function(d) {
                        if (d.code == 0) {
                            self.mod.unable = false;
                            self.$Message.info('成功');
                            self.getData();
                        }
                    },
                    self
                );
            },
            handleView(url) {
                this.imgUrl = url;
                this.mod.showimg = true;
            },
            changePage(pageIndex) {
                this.page = pageIndex;
                this.getData();
            },
            searchfn() {
                this.page = 1;
                this.getData();
            },
            canclefn() {
                this.searchDate = {
                    account: ""
                };
                this.getData();
            }
        }
    };
</script>
