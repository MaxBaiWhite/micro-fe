import {registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start} from 'qiankun';
import {addcookie}  from '@/utils';
import {GetSystemInfo}  from '@/services';
// @ts-ignore
import render from './VueRender.ts';
import './assets/css/commonStyle.scss';

// addcookie('rootRoleId', '1001')
// addcookie('rootUserCode', '1001')
// addcookie('rootUserId', '1001')
// addcookie('rootUserName', 'admin')

function genActiveRule(routerPrefix: string) {
    return (location: any) => location.pathname.startsWith(routerPrefix);
}
(async function () {
    let registerMicroAppsList = []
    // @ts-ignore
    window.plantformInfo=await GetSystemInfo({})
    // @ts-ignore
    for (let item of window.plantformInfo.projects) {
        registerMicroAppsList.push({
            name: item.projectName,
            entry: item.projectUrl,
            render,
            // @ts-ignore
            activeRule: genActiveRule(process.env.VUE_APP_base + item.projectBase),
        })
    }

    /**
     * Step1 初始化应用（可选）
     */
    render({appContent: '', loading: true});

    /**
     * Step2 注册子应用
     */
    registerMicroApps(registerMicroAppsList
        // [
            // {
            //     name: 'vue',
            //     entry: 'http://172.16.26.222:9999',
            //     render,
            //     activeRule: genActiveRule('/vue'),
            // },
            // {
            //     name: 'app',
            //     entry: 'http://172.16.26.222/app/',
            //     render,
            //     activeRule: genActiveRule('/app'),
            // },
            // {
            //     name: 'master',
            //     entry: 'https://192.168.125.10/mdct-mi-pro/html-bayerotc/',
            //     render,
            //     activeRule: genActiveRule('/mdct-mi-pro/manage/master'),
            // }
            // {
            //     name: 'master',
            //     entry: 'https://ca.healthstar.pharmeyes.com/insv/micro-fe-platform-dev',
            //     render,
            //     activeRule: genActiveRule('/hpgc/hpgc-manage-dev/master'),
            // }
        // ]
        ,
        // @ts-ignore
        {
            beforeLoad: [
                async (app) => {
                    // console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
                },
            ],
            beforeMount: [
                async (app)  => {
                    // console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
                    history.replaceState(null, location.pathname, location.pathname)
                },
            ],
            afterUnmount: [
                async (app)  => {
                    // console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
                },
            ],
        },
    );

    /**
     * Step3 设置默认进入的子应用
     */
// setDefaultMountApp('/');

    /**
     * Step4 启动应用
     */
    start({
        prefetch: 'all',
        sandbox :false,
        singular: true,
        fetch: window.fetch
    });

    runAfterFirstMounted(() => {
        // console.log('[MainApp] first app mounted');
    });
})()