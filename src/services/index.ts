import {http} from '@/request'

export async function GetMenu(p:object) {
    let res = await  http.post('/rbac/bs/rmnfBody',p)
    return res
}
export async function GetSystemInfo(data:object):Promise<any> {
    let res = await http.post('/mife/config/get',data)
    return res
}