import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在?'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足? '
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/dicBase',
        name: 'dicBase',
        title: '数据字典',
        component: Main,
        children: [
            {
                path: 'proName',
                title: '品名管理',
                name: 'proName',
                component: resolve => { require(['./views/dicBase/proName/proName.vue'], resolve); }
            },
            {
                path: 'process',
                title: '加工方式',
                name: 'process',
                component: resolve => { require(['./views/dicBase/process/process.vue'], resolve); }
            },
            {
                path: 'proInstruction',
                title: '加工说明',
                name: 'proInstruction',
                component: resolve => { require(['./views/dicBase/proInstruction/proInstruction.vue'], resolve); }
            },
            {
                path: 'materielTpye',
                title: '物料类型',
                name: 'materielTpye',
                component: resolve => { require(['./views/dicBase/materielType/materielTpye.vue'], resolve); }
            },
            {
                path: 'bottomColorM',
                title: '底色管理',
                name: 'bottomColorM',
                component: resolve => { require(['./views/dicBase/bottomColorM/bottomColorM.vue'], resolve); }
            },
            {
                path: 'MaterialLine',
                title: '物料纹理',
                name: 'MaterialLine',
                component: resolve => { require(['./views/dicBase/MaterialLine/MaterialLine.vue'], resolve); }
            },
            {
                path: 'lineColor',
                title: '纹理颜色',
                name: 'lineColor',
                component: resolve => { require(['./views/dicBase/lineColor/lineColor.vue'], resolve); }
            },
            {
                path: 'util',
                title: '数量单位',
                name: 'util',
                component: resolve => { require(['./views/dicBase/util/util.vue'], resolve); }
            },
            {
                path: 'houseType',
                title: '户型管理',
                name: 'houseType',
                component: resolve => { require(['./views/dicBase/houseType/houseType.vue'], resolve); }
            },
            {
                path: 'scaleArea',
                title: '量尺区域',
                name: 'scaleArea',
                component: resolve => { require(['./views/dicBase/scaleArea/scaleArea.vue'], resolve); }
            }
        ]
    },
    {
        path: '/comStoreManage',
        name: 'comStoreManage',
        title: '公司门店管理',
        component: Main,
        children: [
            {
                path: 'comManage',
                title: '公司管理',
                name: 'comManage',
                component: resolve => {
                    require(['./views/comStoreManage/comManage/comManage.vue'], resolve);
                }
            },
            {
                path: 'comStoreRecords',
                title: '分公司/门店记录',
                name: 'comStoreRecords',
                component: resolve => {
                    require(['./views/comStoreManage/comStoreRecords/comStoreRecords.vue'], resolve);
                }
            }
            // ,{
            //     path: 'comLevelSettings',
            //     title: '公司级别设置',
            //     name: 'comLevelSettings',
            //     component: resolve => {
            //         require(['./views/comStoreManage/comLevelSet/comLevelSet.vue'], resolve);
            //     }
            // }
        ]
    },
    {
        path: '/userManage',
        name: 'userManage',
        title: '用户管理',
        component: Main,
        children: [
            {
                path: 'user',
                title: '平台账号',
                name: 'user',
                component: resolve => { require(['./views/userManage/user/user.vue'], resolve); }
            },
            {
                path: 'role',
                title: '平台角色',
                name: 'role',
                component: resolve => { require(['./views/userManage/role/role.vue'], resolve); }
            },
            {
                path: 'spreaduser',
                title: '设置推广账号',
                name: 'spreaduser',
                component: resolve => { require(['./views/userManage/user/spreaduser.vue'], resolve); }
            }
        ]
    }
    // {
    //     path: '/meManage',
    //     name: 'meManage',
    //     title: '会员管理',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'MemberList',
    //             title: '会员列表',
    //             name: 'MemberList',
    //             component: resolve => { require(['./views/meManage/MemberList/MemberList.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/bSetting',
    //     name: 'bSetting',
    //     title: '业务设置',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'package',
    //             title: '充值套餐',
    //             name: 'package',
    //             component: resolve => { require(['./views/bSetting/package/package.vue'], resolve); }
    //         },
    //         {
    //             path: 'paramSet',
    //             title: '参数配置',
    //             name: 'paramSet',
    //             component: resolve => { require(['./views/bSetting/paramSet/paramSet.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/order',
    //     name: 'order',
    //     title: '订单记录',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'useRecord',
    //             title: '用车记录',
    //             name: 'useRecord',
    //             component: resolve => { require(['./views/order/useRecord/useRecord.vue'], resolve); }
    //         },
    //         {
    //             path: 'recharge',
    //             title: '充值订单',
    //             name: 'recharge',
    //             component: resolve => { require(['./views/order/recharge/recharge.vue'], resolve); }
    //         },
    //         {
    //             path: 'monthCard',
    //             title: '月卡订单',
    //             name: 'monthCard',
    //             component: resolve => { require(['./views/order/monthCard/monthCard.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/moneyManage',
    //     name: 'moneyManage',
    //     title: '款项管理',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'turnover',
    //             title: '营业流水',
    //             name: 'turnover',
    //             component: resolve => { require(['./views/moneyManage/turnover/turnover.vue'], resolve); }
    //         },
    //         {
    //             path: 'storeIncome',
    //             title: '门店收益',
    //             name: 'storeIncome',
    //             component: resolve => { require(['./views/moneyManage/storeIncome/storeIncome.vue'], resolve); }
    //         },
    //         {
    //             path: 'opraIncome',
    //             title: '运营商收益',
    //             name: 'opraIncome',
    //             component: resolve => { require(['./views/moneyManage/opraIncome/opraIncome.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/userManage',
    //     name: 'userManage',
    //     title: '用户管理',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'user',
    //             title: '用户管理',
    //             name: 'user',
    //             component: resolve => { require(['./views/userManage/user/user.vue'], resolve); }
    //         },
    //         {
    //             path: 'role',
    //             title: '角色权限',
    //             name: 'role',
    //             component: resolve => { require(['./views/userManage/role/role.vue'], resolve); }
    //         }
    //     ]
    // }
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'text-editor',
    //             icon: 'compose',
    //             name: 'text-editor',
    //             title: '富文本编辑器',
    //             component: resolve => { require(['./views/my_components/text-editor/text-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: resolve => { require(['./views/my_components/markdown-editor/markdown-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'image-editor',
    //             icon: 'crop',
    //             name: 'image-editor',
    //             title: '图片预览编辑',
    //             component: resolve => { require(['./views/my_components/image-editor/image-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: resolve => { require(['./views/my_components/draggable-list/draggable-list.vue'], resolve); }
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: resolve => { require(['./views/my_components/file-upload/file-upload.vue'], resolve); }
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             component: resolve => { require(['./views/my_components/count-to/count-to.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['./views/form/article-publish/article-publish.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['./views/form/work-flow/work-flow.vue'], resolve); } }

    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require(['./views/access/access.vue'], resolve); } },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require(['./views/access/access.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['./views/tables/dragable-table.vue'], resolve); } },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['./views/tables/editable-table.vue'], resolve); } },
    //         // { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['./views/tables/searchable-table.vue'], resolve); } },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['./views/tables/exportable-table.vue'], resolve); } },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['./views/tables/table-to-image.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['./views/advanced-router/mutative-router.vue'], resolve); } },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['./views/advanced-router/argument-page.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['./views/error_page/error-page.vue'], resolve); } }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
