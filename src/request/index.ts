import axios from 'axios'
import {Message} from 'element-ui'
import {getcookie} from '@/utils'
import qs from 'qs'

/**
 * json类型请求
 */

let http:any = axios.create({});
// @ts-ignore
http.defaults.baseURL = process.env.VUE_APP_context;
http.defaults.headers.post['Content-Type'] = 'application/json';
http.defaults.timeout = 70000;//超时时间
http.interceptors.request.use((config: any) => {
    config.url = config.url +'?_csrf='+getcookie('XSRF-TOKEN')
    // config.data = Object.assign({}, config.data, {
    //     roleCode: 'flow_beitong',
    //     userId: '17747'
    //   })
    return config
});
http.interceptors.response.use((response: any) => {
    if (response.headers['content-type'].indexOf('html')<0) {
        if (response.data.errorCode !==undefined && response.data.errorCode !== '0') {
            Message.error(response.data.errorMsg);
            Promise.reject()
        }
        return response.data
    } else {
        // @ts-ignore
        location.href=process.env.VUE_APP_logoutPath
    }

},(err: any) => {
    if (err.stack.indexOf('Network Error') > 0) {
        Message.error('网络走丢了☺!');
    }
});
let httpForm:any = axios.create({});
// @ts-ignore
httpForm.defaults.baseURL = process.env.VUE_APP_context;
httpForm.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
httpForm.defaults.timeout = 70000;//超时时间
httpForm.interceptors.request.use((config: any) => {
    config.url = config.url +'?_csrf='+getcookie('XSRF-TOKEN')
    // config.data = Object.assign({}, config.data, {
    //     roleCode: 'flow_beitong',
    //     userId: '17747'
    //   })
    config.data = qs.stringify({ p: JSON.stringify(config.data) }, { arrayFormat: 'repeat' })
    return config
});
httpForm.interceptors.response.use((response: any) => {
    if (response.headers['content-type'].indexOf('html')<0) {
        if (response.data.errorCode !==undefined && response.data.errorCode !== '0') {
            Message.error(response.data.errorMsg);
            Promise.reject()
        }
        return response.data
    } else {
        // @ts-ignore
        location.href=process.env.VUE_APP_logoutPath
    }
},(err: any) => {
    if (err.stack.indexOf('Network Error') > 0) {
        Message.error('网络走丢了☺!');
    }
});
export {http,httpForm}
