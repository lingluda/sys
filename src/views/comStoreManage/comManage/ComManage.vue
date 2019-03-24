<template>
    <div>
        <!--Tab-->
        <Row class="margin-top-10 tab">
            <Tabs type="card" @on-click="getTabsData"> <!-- getTabsData 不写()默认会把 name 里的值传过去-->
                <TabPane v-for="(tab,key) in tabs" :key="tab" :label="tab" :name="key">
                    <!--搜索-->
                    <div style="margin-bottom: 10px;">
                        <Input v-model="comNameKeyWord" placeholder="公司名称" clearable style="width: 200px;margin-right: 10px;"></Input>
                        <Button type="primary" icon="ios-search" @click="searchFilter()">搜索</Button>
                        <Button @click="comNameKeyWord = ''" class="margin-left-10">取消</Button>
                    </div>
                    <!--搜索 end-->
                    <Table border :columns="columnsArr" :data="dataArr"></Table>
                </TabPane>
            </Tabs>
        </Row>
        <!--Tab end-->
        <!--页码-->
        <Page :total="total" :page-size="size" :show-total="true" :index="11" :current="page" @on-change="changePage"
              class="padding-left-10 taRit"></Page>
        <!--页码 end-->
        <!--审核弹框-->
        <Modal
                v-model="modalVerify"
                :title="modalName"
                width="1000">
            <Form :model="formItem" :label-width="80" ref="VerifyVerify" :rules="verifyRuleValidate" >
                <Row class="viewList">
                    <Col span="10">
                        <p><span>公司名称</span>{{formItem.name}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <p><span>企业法人</span>{{formItem.legalPerson}}</p>
                    </Col>
                </Row>
                <Row class="viewList">
                    <Col span="10">
                        <p><span>公司地址</span>{{formItem.address}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <p><span>联系电话</span>{{formItem.phone}}</p>
                    </Col>
                </Row>
                <Row class="viewList">
                    <Col span="10">
                        <p><span>QQ</span>{{formItem.qq}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <p><span>微信</span>{{formItem.wx}}</p>
                    </Col>
                </Row>
                <Row class="viewList">
                <Col span="22">
                    <Col span="3">
                        <p><span>经营范围</span></p>
                    </Col>
                    <Col span="17">
                        <p>{{formItem.scope}}</p>
                    </Col>
                </Col>
                </Row>
                <Row class="viewList">
                    <Col span="10">
                        <p><span>账号类型</span>{{formItem.receivablesType}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <p><span>收款人</span>{{formItem.receivablesName}}</p>
                    </Col>
                </Row>
                <Row class="viewList">
                    <Col span="10">
                        <p><span>银行账户</span>{{formItem.receivablesAccount}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <p><span>银行名</span>{{formItem.receivablesBank}}</p>
                    </Col>
                </Row>
                <Row class="viewList">
                    <Col span="10">
                        <p><span>银行所在地</span>{{formItem.receivablesBankAddress}}</p>
                    </Col>
                    <Col span="10" offset="2">
                        <FormItem label="处理结果">
                            <RadioGroup v-model="formItem.verifyStatus" @on-change="statusChange(formItem.verifyStatus)">
                                <Radio label="2">通过</Radio>
                                <Radio label="3">未通过</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-show="auditOpinionShow">
                    <Col span="10" offset="12">
                        <FormItem label="审核意见" prop="auditOpinion">
                            <Input v-model="formItem.auditOpinion" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="verifyFun('VerifyVerify')">提交</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <!--审核弹框 end-->
        <!--查看弹框-->
        <Modal
                v-model="modalView"
                :title="modalName"
                width="1000">
            <Row class="viewList">
                <Col span="10">
                    <p><span>公司名称</span>{{formItem.name}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>企业法人</span>{{formItem.legalPerson}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>公司地址</span>{{formItem.address}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>联系电话</span>{{formItem.phone}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>QQ</span>{{formItem.qq}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>微信</span>{{formItem.wx}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="3">
                    <p><span>经营范围</span></p>
                </Col>
                <Col span="17">
                    <p>{{formItem.scope}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>账号类型</span>{{formItem.receivablesType}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>收款人</span>{{formItem.receivablesName}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>银行账户</span>{{formItem.receivablesAccount}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>银行名</span>{{formItem.receivablesBank}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>银行所在地</span>{{formItem.receivablesBankAddress}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>审核意见</span>{{formItem.auditOpinion}}</p>
                </Col>
            </Row>
        </Modal>
        <!--查看弹框 end-->
        <!--添加账号弹框-->
        <Modal
                v-model="addAccount"
                title="添加账号1"
                width="500">
            <Form :label-width="80" ref="addAccountForm" :rules="ruleValidate" :model="addAccountDate">
                <FormItem label="账号" prop="account">
                    <Input type="text" col="span" v-model="addAccountDate.account"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" col="span" v-model="addAccountDate.password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPassword">
                    <Input type="password" col="span" v-model="addAccountDate.confirmPassword"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('addAccountForm')">提交</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <!--添加账号弹框 end-->
    </div>
</template>
<script>
    import util from "@/libs/util";

    export default {
        data() {
            const confirmPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('确认密码不能为空！'));
                } else if (value !== this.addAccountDate.password) {
                    callback(new Error('两次输入的密码不相同！'));
                } else {
                    callback();
                }
            };
            return {
                loading: true,
                status: 1,
                total: 0,
                size: 12,
                page: 1,
                comNameKeyWord: '',
                modalVerify: false,
                addAccount: false,
                addAccountCompanyId: 0,
                addAccountDate: {
                    account:'',
                    password:'',
                    confirmPassword:''
                },
                modalName: '',
                formItem: {
                },
                comId: '',
                auditOpinionShow: false,
                modalView: false,
                tabs: {1: '待审核', 2: '已通过', 3: '未通过'},
                columnsArr: [],
                dataArr: [],
                columnsPending: [
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '公司名称',
                        key: 'name'
                    },
                    {
                        title: '公司地址',
                        key: 'address'
                    },
                    {
                        title: '法人姓名',
                        key: 'legalPerson'
                    },
                    {
                        title: '联系电话',
                        key: 'phone'
                    },
                    {
                        title: '创建时间',
                        key: 'gmtCreate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    on: {
                                        click: () => {
                                            this.verify(params.index, this.dataArr[params.index].name)
                                        }
                                    }
                                }, '审核')
                            ]);
                        }
                    }
                ],
                columnsPassed: [
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '公司名称',
                        key: 'name'
                    },
                    {
                        title: '公司地址',
                        key: 'address'
                    },
                    {
                        title: '联系电话',
                        key: 'phone'
                    },
                    {
                        title: '创建时间',
                        key: 'gmtCreate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                //     h('Button', {
                                //         style: {
                                //             marginRight: '10px'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 console.log('禁用');
                                //             }
                                //         }
                                //     }, '禁用'),
                                //     h('Button', {
                                //         style: {
                                //             marginRight: '10px'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 console.log('公司级别');
                                //             }
                                //         }
                                //     }, '公司级别'),
                                //     h('Button', {
                                //         style: {
                                //             marginRight: '10px'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 console.log('功能设置')
                                //             }
                                //         }
                                //     }, '功能设置'),
                                //     h('Button', {
                                //         style: {
                                //             marginRight: '10px'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 console.log('软件销售')
                                //             }
                                //         }
                                //     }, '软件销售'),
                                //     h('Button', {
                                //         style: {
                                //             marginRight: '10px'
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 console.log('销售记录')
                                //             }
                                //         }
                                //     }, '销售记录'),
                                h('Button', {
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.addAccount = true;
                                            this.addAccountCompanyId = params.row.id;
                                        }
                                    }
                                }, '添加账号')
                            ]);
                        }
                    }
                ],
                columnsNoPass: [
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '公司名称',
                        key: 'name'
                    },
                    {
                        title: '公司地址',
                        key: 'address'
                    },
                    {
                        title: '法人姓名',
                        key: 'legalPerson'
                    },
                    {
                        title: '联系电话',
                        key: 'phone'
                    },
                    {
                        title: '创建时间',
                        key: 'gmtCreate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.view(params.index, this.dataArr[params.index].name)
                                        }
                                    }
                                }, '查看'),
                            ]);
                        }
                    }
                ],
                ruleValidate: {
                    account: [
                        {required: true, message: '账号不能为空'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空'}
                    ],
                    confirmPassword: [
                        {required: true,validator: confirmPassword }
                    ]
                },
                verifyRuleValidate: {
                    auditOpinion: [
                        {required: true, message: '审核意见不能为空'}
                    ]
                }
            }
        },
        created() {
            this.getData('1');
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let param = {
                            companyId: this.addAccountCompanyId,//公司id
                            account: this.addAccountDate.account, // 账号
                            password: this.addAccountDate.password // 密码
                        };
                        util.ajaxY("/sys/companyUser/insertSpread", param, (d) => {
                            if (d.code === '0') {
                                this.$Message.success('添加成功！');
                                this.addAccount = false;
                                this.addAccountDate = {
                                    account:'',
                                    password:'',
                                    confirmPassword:''
                                };
                            }else {
                                this.$Message.error(d.msg);
                            }
                            this.$Message.destroy();
                        }, this);
                    }
                })
            },
            getData(status) {
                this.status = status;
                let self = this,
                    param = {
                        status: this.status,
                        name: util.trim(this.comNameKeyWord),//名字
                        pageIndex: this.page, //页码
                        pageSize: this.size //每页条数
                    };
                if (status === '1') {
                    this.columnsArr = this.columnsPending;
                } else if (status === '2') {
                    this.columnsArr = this.columnsPassed;
                } else if (status === '3') {
                    this.columnsArr = this.columnsNoPass;
                }
                util.ajaxY("/sys/company/list", param, function (d) {
                    if (d.code === '0') {
                        self.dataSearchArr = self.dataArr = d.data.rows;
                        self.total = d.data.total;
                    }
                }, self);
            },
            getTabsData(status){
                this.comNameKeyWord = '';
                this.page = 1;
                this.getData(status);
            },
            verify(index, name) {
                this.modalVerify = true;
                this.modalName = name;
                this.formItem = this.dataArr[index];
                this.formItem.verifyStatus='2';
                this.formItem.auditOpinion='默认审核意见';
                this.comId = this.formItem.id;
            },
            verifyFun(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let self = this,
                            param = {
                                id: this.comId,//公司id
                                auditOpinion: this.formItem.auditOpinion, // 审核意见
                                status: this.formItem.verifyStatus // 审核状态
                            };
                        util.ajaxY("/sys/company/companyAudit", param, function (d) {
                            if (d.code === '0') {
                                self.modalVerify = false;
                                self.getData(self.status);
                                self.$Message.success('审核成功！');
                            }
                        }, self);
                    }
                })
            },
            view(index, titleName) {
                this.modalView = true;
                this.modalName = titleName;
                this.formItem = this.dataArr[index];
            },
            statusChange(val) {
                val !== '3'? this.formItem.auditOpinion = '默认审核意见':this.formItem.auditOpinion ='';
                //审核意见显示隐藏
                this.auditOpinionShow = val !== '2';
            },
            searchFilter() {
                this.page = 1;
                this.getData(this.status);
            },
            changePage(pageIndex) {
                this.page = pageIndex;
                this.getData(this.status);
            }
        }
    }
</script>
<style scoped>
    .viewList {
        font-size: 16px;
        color: #777;
        overflow: hidden;
    }

    .viewList p {
        margin-bottom: 20px;
    }

    .viewList p span {
        display: inline-block;
        width: 85px;
        text-align: right;
        margin-right: 30px;
        color: #222;
    }
    body .modalFooter {
        padding: 0;
        border-top: none;
    }
</style>