import {http} from '@/request'

export async function GetPage(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/find', data)
    return res
}

export async function AddEx(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/addEx', data)
    return res
}

export async function ModifyEx(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/modifyEx', data)
    return res
}

export async function Removes(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/removes', data)
    return res
}

export async function GetEx(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/getEx', data)
    return res
}

export async function GetRoleList(data: object): Promise<any> {
    let res = await http.post('/yhgl/rolebase/findall', data)
    return res
}