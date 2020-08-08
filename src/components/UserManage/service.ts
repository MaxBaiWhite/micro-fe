import {http} from '@/request'


export async function GetUserList(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/urlt', data)
    return res
}

export async function GetRoleList(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/rlnf', data)
    return res
}

export async function AddUser(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/urcr', data)
    return res
}

export async function ChangeUser(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/urchs', data)
    return res
}

export async function DeleteUsers(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/deleteUsers', data)
    return res
}


export async function GetUserInfo(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/urnf', data)
    return res
}

export async function GetPostList(data: object): Promise<any> {
    let res = await http.post('/yhgl/postbase/find', data)
    return res
}

