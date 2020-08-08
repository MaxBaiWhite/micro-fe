
import Vue from 'vue/dist/vue.esm';
import NProgress  from 'nprogress';
import UserManage from '@/components/UserManage'
import RoleManage from '@/components/RoleManage'
import PostManage from '@/components/PostManage'
import {GetMenu} from '@/services'
import {getcookie} from '@/utils'
import {
    Button,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Row,
    Col,
    Icon,
    Breadcrumb,
    BreadcrumbItem,
    Avatar,
    MessageBox
} from 'element-ui'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false,parent: 'body' });
Vue.config.silent = true
Vue.prototype.$msgbox = MessageBox

function vueRender({appContent, loading}: appType) {
    return new Vue({
        template: `
            <div id="w-container">
                <Row class="w-main-all-Block">
                    <div class="w-main-left-Block">
                        <a href="" class="w-menu-title">
                            <img v-if="systemInfo.titleImage" :src="systemInfo.titleImage" alt="">
                            <span style="font-weight: 800;" v-show="!isCollapse">
                                {{systemInfo.title}}
                                <span style="font-weight: normal"></span>
                            </span>
                        </a>
                        <Menu class="w-menu" :default-active="pathId" :collapse-transition="false" :collapse="isCollapse"
                              text-color="#b8bec8" active-text-color="#fff"
                              background-color="#00386c"
                        >
                            <Submenu :index="submenu.menuOrder" v-for="submenu in menuList">
                                <template slot="title">
                                    <i class="el-icon-s-help"/>
                                    <span>{{submenu.menuName}}</span>
                                </template>
                                <MenuItemGroup v-for="menuItem in submenu.children">
                                    <MenuItem @click="routerPush(menuItem.menuUrl)"  :index="submenu.menuOrder+'-'+menuItem.menuOrder">
                                        {{menuItem.menuName}}
                                    </MenuItem>
                                </MenuItemGroup>
                            </Submenu>
                        </Menu>
                    </div>
                    <!-- 菜单 -->

                    <div class="w-main-right-Block">
                        <div class="w-title">
                            <div v-show="!isCollapse" class="w-collapse-block">
                                <i class="el-icon-s-fold" @click="actionCollapse(true)"></i>
                            </div>
                            <div v-show="isCollapse" class="w-collapse-block">
                                <i  class="el-icon-s-unfold" @click="actionCollapse(false)"></i>
                            </div>
                            <div class="w-person-info">
                                <Avatar icon="el-icon-s-custom" style="height: 30px;width: 30px;font-size: 20px"/>
                                <span>
                                    {{userInfo.rootUserName}}
                                </span>
                                <span @click="logout"><Icon class="el-icon-switch-button" />注销</span>
                            </div>
                        </div>
                        
                        <Breadcrumb class="w-breadcrumb" separator=">">
                            <BreadcrumbItem v-for="item in breadcrumbList"  class="Breadc"><span class="Breadc-text" @click="routerPush(item.url)">{{item.name}}</span></BreadcrumbItem>
                        </Breadcrumb>
                        <div class="w-main-Block w-pageInner" v-if="isSelfPage === 1">
                            <UserManage/>
                        </div>
                        <div class="w-main-Block w-pageInner" v-if="isSelfPage === 2">
                            <RoleManage/>
                        </div>
                        <div class="w-main-Block w-pageInner" v-if="isSelfPage === 3">
                            <PostManage/>
                        </div>
<!--                        <transition name="fade">-->
                        <div class="w-main-Block w-qkpage" v-show="isSelfPage === 0 && isPageShow" v-html="appContent"/>
<!--                        </transition>-->
                    </div>
                </Row>

            </div>
        `,
        el: '#container',
        components: {
            Button,
            Menu,
            Submenu,
            MenuItemGroup,
            MenuItem,
            Row,
            Col,
            Icon,
            Breadcrumb,
            BreadcrumbItem,
            Avatar,
            UserManage,
            RoleManage,
            PostManage
        },
        data() {
            return {
                appContent,
                loading,
                isCollapse: false,
                isPageShow: true,
                menuList: [],
                breadcrumbList: [],
                isSelfPage: 0,
                //变化完的pathname
                pathname: '',
                pathId: '',
                userInfo:{
                    rootUserName:getcookie('rootUserName'),
                    rootRoleId:getcookie('rootRoleId'),
                    rootUserId:getcookie('rootUserId'),
                    rootUserCode:getcookie('rootUserCode'),
                },
                systemInfo: {},
                routers: ['urlt','rolelt','postlt']
            };
        },
        beforeMount() {

        },
        mounted() {
            this.getData()
            this.initDom()
            window.onresize = () => {
                this.actionCollapse()
            }
            history.pushState = this.watchEvents('pushState');
            history.replaceState = this.watchEvents('replaceState');
            window.addEventListener('replaceState', () => {
                this.analyseRouter()
            });
            window.addEventListener('pushState', () => {
                this.analyseRouter()
            });
            window.onpopstate = () => {
                this.analyseRouter()
            }
        },

        watch: {
            loading: function (e) {
                if (e) {
                    this.isPageShow = false
                    NProgress.start()
                } else {
                    let timer = setTimeout(() => {
                        NProgress.done()
                        this.isPageShow = true
                        clearTimeout(timer)
                    })
                }
            }
        },
        methods: {
            async getData() {
                this.systemInfo = window.plantformInfo
                document.title = this.systemInfo.title
                let menuRes = await GetMenu({roleId:getcookie('rootRoleId'),reqUserId:getcookie('rootUserId')})
                this.menuList = menuRes
                this.analyseRouter()
                setTimeout(() => {
                    this.actionCollapse()
                },0)
            },
            watchEvents (type) {
                let _event = history[type]
                return function () {
                    let _eventResult = _event.apply(this, arguments)
                    let newEvent = new Event(type)
                    newEvent.arguments = arguments;
                    window.dispatchEvent(newEvent)
                    return _eventResult
                }
            },
            initDom() {
                // let lis = document.getElementsByClassName('el-menu-item')
                // for (let item of lis) {
                //     //@ts-ignore
                //     item.oncontextmenu = function (e) {
                //         e.preventDefault();
                //         window.open('https://www.baidu.com')
                //     }
                // }
            },
            routerPush(subapp: string) {
                let subappArr = subapp.split('/')
                let pathnameArr = location.pathname.split('/')
                if (subappArr[subappArr.length-1] === pathnameArr[pathnameArr.length-1]) {
                    return false
                }
                let temSubapp = process.env.VUE_APP_base + subapp
                history.pushState(null, temSubapp, temSubapp)
                // this.analyseRouter()
            },
            routerReplace(subapp: string) {
                let subappArr = subapp.split('/')
                let pathnameArr = location.pathname.split('/')
                if (subappArr[subappArr.length-1] === pathnameArr[pathnameArr.length-1]) {
                    return false
                }
                let temSubapp = process.env.VUE_APP_base + subapp
                history.replaceState(null, temSubapp, temSubapp)
                // this.analyseRouter()
            },
            //调整宽度高度
            actionCollapse(e?: boolean) {
                this.isCollapse = typeof e === 'undefined'?this.isCollapse : e;
                let DomMenu = document.getElementsByClassName('w-menu')[0]
                let DomMainRightBlock = document.getElementsByClassName('w-main-right-Block')[0]
                if (this.isCollapse) {
                    DomMenu.style.width = '64px'
                    DomMainRightBlock.style.width = window.innerWidth - 64 + 'px'
                } else {
                    DomMenu.style.width = '256px;'
                    DomMainRightBlock.style.width = window.innerWidth - 256 + 'px'
                }
                setTimeout(() => {
                    this.changeMainHeight()
                })

            },
            changeMainHeight () {
                let DomMenu = document.getElementsByClassName('w-menu')[0]
                let DomMainBlock = document.getElementsByClassName('w-main-Block')
                for(let item of DomMainBlock){
                    item.style.height = window.innerHeight - 128 + 'px'
                }
                DomMenu.style.height = window.innerHeight - 64 + 'px'
            },
            //路由面包屑唯一入口，判断显示容器
            analyseRouter() {
                this.pathname = location.pathname
                let temPathname = location.pathname.split('/')
                //设置面包屑
                this.setBreadcrumbList()
                for (let i = 0; i < this.routers.length;i++) {
                    let item  = this.routers[i]
                    if (temPathname[temPathname.length-1] === item) {
                        this.isSelfPage = i + 1
                        this.loading = false
                        return false
                    }
                    this.isSelfPage = 0
                }
                //是否匹配成功
                if (this.breadcrumbList.length <= 1 && this.menuList && this.menuList.length>0) {
                    this.routerReplace(this.menuList[0].children[0].menuUrl)
                }
            },
            //设置面包屑
            setBreadcrumbList () {
                let temarr = []
                let temBreadcrumbList = [{name:'首页',url:''}]
                for(let item of this.menuList){
                    let parentId = item.menuOrder
                    for(let im of item.children){
                        temarr.push(Object.assign({}, im, {id: parentId+'-'+im.menuOrder}))
                    }
                }
                this.breadcrumbList = [...temBreadcrumbList, ...this.analyseBreadcrumbList(temarr)]
            },
            //生成面包屑
            analyseBreadcrumbList (menu) {
                let temBreadcrumbList = []
                for (let item of menu) {
                    if (this.pathname.indexOf(item.menuUrl) >= 0) {
                        temBreadcrumbList.push({name:item.menuName,url:item.menuUrl})
                        if (item.id) {
                            this.pathId = item.id
                        }
                        if (item.children&&item.children.length > 0) {
                            temBreadcrumbList = [...temBreadcrumbList,...this.analyseBreadcrumbList(item.children)]
                        }
                    }
                }
                return temBreadcrumbList
            },
            //注销
            async logout () {
                await this.$msgbox.confirm('此操作将退出系统, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                });
                let f = document.createElement('form')
                f.action = process.env.VUE_APP_logoutPath + 'logout'
                f.method = 'post'
                f.target = ''
                f.style.display = 'none'
                document.body.appendChild(f)

                let csrfDom = document.createElement('input')
                csrfDom.type = 'hidden'
                csrfDom.name = '_csrf'
                csrfDom.value = getcookie('XSRF-TOKEN')
                f.appendChild(csrfDom)
                f.submit()
                let timer = setTimeout(() => {
                    f.remove()
                    clearTimeout(timer)
                }, 500)
            }
        }
    });
}

let app: any = null;

export default function render({appContent, loading}: appType) {
    if (!app) {
        app = vueRender({appContent, loading});
    } else {
        app.appContent = appContent;
        app.loading = loading;
    }
}
