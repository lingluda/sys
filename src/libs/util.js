import axios from 'axios';
import Cookies from 'js-cookie';
import env from '../config/env';

let util = {

};
util.title = function (title) {
    title = title || '创崛石材';
    window.document.title = title;
};
const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8888' :
    env === 'production' ?
    'https://www.url.com' :
    'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});
// util.ajaxY = function (url, param, f, obj) {
//     axios.post(url,{data:param},
//         //  {
//         //     action:act,
//         //     data:JSON.stringify(param)
//         // }
//     ).then(
//             response => {
//                 obj.tabload=false;
//                 f(response.data);
//                 let tmp = response.data;
//                 // if (tmp.code == 401) {
//                 //     //去登录
//                 //     obj.$Message.error(tmp.msg);
//                 //     setTimeout(function(){
//                 //         Cookies.remove('user');
//                 //         Cookies.remove('password');
//                 //         location.reload();
//                 //     },500);
//                 // }else 
//                 if (!tmp.success) {
//                     obj.$Message.error(tmp.msg);
//                 }
//             })
//         .catch((err) => {
//             console.log(err);
//         })
// };
util.ajaxY = function (url, param, f, obj) {
    axios.post(url, {
            data:param
        }).then(
            response => {
                obj.tabload=false;
                f(response.data);
                let tmp = response.data;
                if (tmp.code == 302) {
                    //去登录
                    obj.$Message.error(tmp.msg);
                    setTimeout(function(){
                        Cookies.remove('user');
                        Cookies.remove('password');
                        location.reload();
                    },500);
                }else if (tmp.code != 0) {
                    obj.$Message.error(tmp.msg);
                }
            })
        .catch((err) => {
            console.log(err);
        })
};
util.ajaxG = function (url,param,f, obj) { 
    axios.get(url, {
        params:param
       })
       .then(function (response) {
            obj.tabload=false;
            f(response.data);
       })
       .catch(function (error) {
        console.log(error);
       });
};
util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && itAccess.isArray()) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    let routerObj = {};
    routers.forEach(item => {
        if (item.name === 'otherRouter') {
            item.children.forEach((child, i) => {
                if (child.name === name) {
                    routerObj = item.children[i];
                }
            });
        } else {
            if (item.children.length === 1) {
                if (item.children[0].name === name) {
                    routerObj = item.children[0];
                }
            } else {
                item.children.forEach((child, i) => {
                    if (child.name === name) {
                        routerObj = item.children[i];
                    }
                });
            }
        }
    });
    return routerObj;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
            path: '',
            name: 'home_index'
        }];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [{
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '首页',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        tag = tag.children ? tag.children[0] : tag;
        if (argu) {
            tag.argu = argu;
        }
        if (query) {
            tag.query = query;
        }
        vm.$store.commit('increateTag', tag);
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};
util.changeRich = function (s) {
    let htm = "";
    if (s && s.indexOf('[') > -1) {
        let arrStr = JSON.parse(s);
        arrStr.forEach(function (val, index, arr) {
            if (val.type == "image") {
                let imgstr = util.alimg(val.content);
                htm += '<img src="' + imgstr + '" class="fulWidth"/>';
                if (val.descriptions) {
                    htm += '<p style="font-size:14px"> ' + val.descriptions + '</p>';
                }
            } else {
                htm += '<p style="font-size:16px"> ' + val.content + '</p>';
            }
            htm += '<br>';
        })
    } else {
        htm = s;
    }
    return htm;
}
util.alimg = function (u, w, h) {
    if(!u) return;
    var xoss = '',
        url;
    if (w || h) {
        xoss = '?x-oss-process=image/resize,m_fill,w_' + w + ',h_' + h + '';
    }
    url = u + xoss;
    if (u.indexOf("http") <= -1) {
        url = 'http://wufunong.oss-cn-shenzhen.aliyuncs.com/' + url;
    }
    return url;
}
util.MP=function(){
    let ak='LOtB50t6E9xGS5NLYjyh70cAutGpm0z1';
    return new Promise(function (resolve, reject) {
        window.init = function () {
       resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
})

}

util.trim=(str)=> {
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
}
export default util;
