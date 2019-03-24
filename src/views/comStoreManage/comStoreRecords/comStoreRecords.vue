<template>
    <div>
        <!--Tab-->
        <Row class="margin-top-10 tab">
            <!--搜索-->
            <div style="margin-bottom: 10px;">
                <Input v-model="comNameKeyWord" placeholder="门店名称" clearable style="width: 200px;margin-right: 10px;"></Input>
                <Button type="primary" icon="ios-search" @click="searchFilter()">搜索</Button>
                <Button @click="comNameKeyWord = ''" class="margin-left-10">取消</Button>
                <Button type="success" icon="arrow-return-left" @click="returnGetData" v-show="returnBtn" style="float: right; margin-right: 50px;">返回</Button>
            </div>
            <!--搜索 end-->
            <Table border :columns="columnsArr" :data="dataSearchArr"></Table>
        </Row>
        <!--Tab end-->
        <!--页码-->
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="padding-left-10 taRit"></Page>
        <!--页码 end-->
        <!--查看弹框-->
        <Modal
                v-model="modalView"
                :title="modalName"
                width="1000">
            <Row class="viewList">
                <Col span="10">
                    <p><span>门店类型</span>{{formItem.type | stroeType}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                    <p><span>门店名称</span>{{formItem.name}}</p>
                </Col>
                <Col span="10" offset="2">
                    <p><span>所属公司</span>{{formItem.companyName}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                <p><span>门店地址</span>{{formItem.address}}</p>
                </Col>
                <Col span="10" offset="2">
                <p><span>联系电话</span>{{formItem.contacts_phone}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                <p><span>成立日期</span>{{formItem.establish_date}}</p>
                </Col>
                <Col span="10" offset="2">
                <p><span>营业期限</span>{{formItem.business_date}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                <p><span>登记机关</span>{{formItem.registration_authority}}</p>
                </Col>
                <Col span="10" offset="2">
                <p><span>注册号</span>{{formItem.registration_number}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="3">
                <p><span>经营范围</span></p>
                </Col>
                <Col span="17">
                <p>{{formItem.scope_operation}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                <p><span>收款类型</span>{{formItem.receivables_type | receiptType}}</p>
                </Col>
                <Col span="10" offset="2">
                <p><span>收款人姓名</span>{{formItem.receivables_name}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="10">
                <p><span>收款账号</span>{{formItem.receivables_account}}</p>
                </Col>
                <Col span="10" offset="2">
                <p><span>收款银行</span>{{formItem.receivables_bank}}</p>
                </Col>
            </Row>
            <Row class="viewList">
                <Col span="22">
                <p><span>银行所在地</span>{{formItem.receivables_bank_address}}</p>
                </Col>
            </Row>
        </Modal>
        <!--查看弹框 end-->
    </div>
</template>
<script>
    import util from "@/libs/util";

    export default {
        data() {
            return {
                loading: true,
                name: '',
                total: 0,
                size: 12,
                page: 1,
                comNameKeyWord: '',
                modalVerify: false,
                modalName: '',
                formItem: {},
                auditOpinionShow: false,
                modalView: false,
                returnBtn:false,
                columnsArr:[],
                dataArr: [],
                dataSearchArr: [],
                columnsRecords: [
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '公司名称',
                        key: 'name'
                    },
                    {
                        title: '加盟店',
                        key: 'jmd'
                    },
                    {
                        title: '直营门店',
                        key: 'zxd'
                    },
                    {
                        title: '合作门店',
                        key: 'hzd'
                    },
                    {
                        title: '管理门店',
                        key: 'gld'
                    },
                    {
                        title: '创建时间',
                        key: 'gmt_create'
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
                                            this.page = 1;
                                            this.comNameKeyWord = '';
                                            this.companyStoreListFn(this.dataSearchArr[params.index].id);
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                companyStoreList:[
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '门店名称',
                        key: 'name'
                    },
                    {
                        title: '门店类型',
                        key: 'type',
                        render: (h, params) => {
                            return h('div', this.typeFilters(params.row.type));
                        }
                    },
                    {
                        title: '门店地址',
                        key: 'address'
                    },
                    {
                        title: '联系电话',
                        key: 'contacts_phone'
                    },
                    {
                        title: '所属公司',
                        key: 'companyName'
                    },
                    {
                        title: '创建时间',
                        key: 'gmt_create'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', this.statusFilters(params.row.status));
                        }
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
                                            this.view(params.index, this.dataArr[params.index].name);
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                statusNow : 'Records'
            }
        },
        created() {
            this.getData();
        },
        filters:{
            stroeType(val){
                switch (val){
                    case 0:
                        return '合作店';
                    case 1:
                        return '加盟店';
                    case 2:
                        return '管理点';
                    case 3:
                        return '直营店';
                }
            },
            receiptType(val){
                switch (val){
                    case 0:
                        return '公司';
                    case 1:
                        return '个人';
                }
            }
        },
        methods: {
            typeFilters(val) {
                switch (val){
                    case 0:
                        return '合作店';
                    case 1:
                        return '加盟店';
                    case 2:
                        return '管理点';
                    case 3:
                        return '直营店';
                }
            },
            statusFilters(val) {
                switch (val){
                    case 0:
                        return '草稿';
                    case 1:
                        return '未审核';
                    case 2:
                        return '已通过';
                    case 3:
                        return '未通过';
                }
            },
            getData() {
                this.returnBtn = false;
                this.statusNow = 'Records';
                this.columnsArr = this.columnsRecords;
                let self = this,
                    param = {
                        name: util.trim(this.comNameKeyWord),//名字
                        pageIndex: this.page, //页码
                        pageSize: this.size //每页条数
                    };
                util.ajaxY("/sys/company/countCompanyStroe", param, function (d) {
                    if (d.code === '0') {
                        self.dataSearchArr = self.dataArr = d.data.rows;
                        self.total = d.data.total;
                    }
                }, self);
            },
            returnGetData(){
                this.page = 1;
                this.comNameKeyWord = '';
                this.getData();
            },
            companyStoreListFn(id){
                id?this.companyId = id:false;
                this.statusNow = 'StoreList';
                this.returnBtn = true;
                let self = this,
                param = {
                    name:this.comNameKeyWord,
                    companyId: this.companyId,//名字
                    pageIndex: this.page, //页码
                    pageSize: this.size //每页条数
                };
                util.ajaxY("/sys/company/companyStorelist", param, function (d) {
                    if (d.code === '0') {
                        self.columnsArr = self.companyStoreList;
                        self.dataSearchArr = self.dataArr = d.data.rows;
                        self.total = d.data.total;
                    }
                }, self);
            },
            view(index, name) {
                this.modalView = true;
                this.modalName = name;
                this.formItem = this.dataArr[index];
            },
            searchFilter() {
                this.page = 1;
                if(this.statusNow === 'StoreList'){
                    this.companyStoreListFn();
                }else if(this.statusNow === 'Records'){
                    this.getData();
                }
            },
            changePage(pageIndex) {
                this.page = pageIndex;
                if(this.statusNow === 'StoreList'){
                    this.companyStoreListFn();
                }else if(this.statusNow === 'Records'){
                    this.getData();
                }
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
</style>