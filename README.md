## 考试管理小程序
- AppID: wx6b5798538bed4c

### 1. 安装

```
// 拉取项目
git clone http://geylab.guangeryi.com:10080/zhangzw/recruit_weapp
```
```
// 进入项目根目录
cd recruit_weapp

// 目前只有一个master分支

// 安装依赖
yarn

// 安装taro
yarn global add @tarojs/cli

// 升级taro
yarn global add @tarojs/cli@latest

// 更新项目的依赖
taro update project

运行项目
```
yarn run dev:weapp
```
测试环境 需要将request文件下的 改成 const baseUrl = 'http://192.168.0.242'
登录接口/admin2/questionAccount，携带的参数有：用户名和手机号校招id
let params ={
    fdName: this.state.name,
    fdMobile: this.state.phone,
    fdResourceId: this.state.fdResourceId
}
每一题的时间有20秒，超时未答的题目，将会被放进下一轮答题，下一轮的答题时间没有限制
this.answerArr.map((item, i) => { // 过滤出未答题的题目
    if (item.answer == '') {
    dataArr.push({
        msg: this.state.TestData[i],
        index: i
    })
    }
})
全部答题结束后，调用结束接口/admin2/questionAccount/saveResult，这里携带的参数是
let params ={
    id: this.state.id, // 用户id
    fdAnswer: JSON.stringify(this.answerArr) // 答案id
}
跳转结束页面