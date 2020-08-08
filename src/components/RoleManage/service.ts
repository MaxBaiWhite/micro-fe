import {http} from '@/request'

export async function GetRoleList(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/roltwh', data)
    return res
}

export async function GetRoleMenuList(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/aultmr', data)
    return res
}
export async function SaveRoleMenuList(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/authrs', data)
    return res
}

export async function AddRole(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/roltcr', data)
    return res
}

export async function ChangeRole(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/roltmrs', data)
    return res
}

export async function GetDetail(data: object): Promise<any> {
    let res = await http.post('/rbac/bs/roltmr', data)
    return res
}
export async function UpdateMenu(data: object): Promise<any> {
    let res = await http.post('rbac/bs/cleanRoleMenu', data)
    return res
}

export async function DeleteRoles(data: object): Promise<any> {
    let res = await http.post('/yhgl/rolebase/deleteRoles', data)
    return res
}
