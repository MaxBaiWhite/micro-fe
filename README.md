# 微前端使用说明

### 运行程序

1.cnpm install  
2.cnpm run serve

### 父项目配置

子项目接入配置在/mife/config/get接口请求返回中，根据个人信息返回。  
具体格式如：  
```
{
  "title": "哈药营销平台", // 平台名称
  "defaultAppUrl": "", // 第一次访问的url
  "projects": [
    {
      "projectUrl": "https://ca.healthstar.pharmeyes.com/insv/cdm-hpgc-qdpt-dev/", // 子项目资源地址
      "projectName": "hpgc-qdpt-dev", // 子项目的名称
      "projectBase": "marketing" // 子项目的标识URL
    }
  ]
}
```
父工程配置在根目录的.env中，根据不同的项目、环境设置不同的.env文件。
例如：
```
PUBLICPATH=/hpgc/hpgc-manage-dev/  // publicPath
dist=dist/hpgc-test/ //打包输出地址
NODE_ENV=hpgc-test //打包环境名称
VUE_APP_context=/ 项目的接口地址
VUE_APP_logoutPath=/ 退出的地址
title=哈药测试环境配置文件 // 文件名称
```

### 子项目环境配置
子项目的base设置成父项目base+子项目的标识URL
