import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
import Item from './item'
import request from '../../request'
export default class Test extends Component {
  config = {
    navigationBarTitleText: '开始考试'
  }
  constructor (props) {
    super(props)
    this.state = {
      animationData: {},
      pageIndex: 1,
      testData: [],
      id: ''
    }
    this.domWidth = 0
    this.animation = Taro.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    // this.answerArr = new Array(40)
    this.answerArr = []
    this.indexArr = []
  }
  
  _nextTest (i, flag=false) {
    let w = this.domWidth
    if(i >= this.state.testData.length) {
      return
    }
    if (!flag && !this.answerArr[i-1]) {
      Taro.showToast({
        title: '请先答完当前题目',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (flag && !this.answerArr[i-1]) {
      this.answerArr[i-1] = {
        id: this.state.testData[i-1].id,
        answer: ''
      }
    }
    this.animation.translateX(-(w * i )).step()
    this.setState({
      animationData: this.animation.export(),
      pageIndex: i + 1
    })
   
  }
  
  componentWillMount() {
    Taro.showLoading({
      title: '加载中',
    })
  }

  componentDidMount () {
    if (this.$router.params && this.$router.params.data) {
      let data = JSON.parse(this.$router.params.data)
      let testData = data.dataArr.map(item => item.msg)
      this.indexArr = data.dataArr.map(item => item.index)
      this.setState({
        testData,
        id: data.id
      })
    }
  }

  _swiper () {
     // 获取dom节点的宽度
     var query = Taro.createSelectorQuery()
     query.select('.tbox').boundingClientRect(rect => {
       this.domWidth =  rect.width/1.05
       // console.log('rect.width', this.domWidth)
     }).exec()
  }

  shandle (item) {
    let params = {
      id: item.id,
      answer: item.answer
    }
    this.answerArr[item.index] = params
  }

  _submit () {
    let answerFlag = this.answerArr[this.state.testData.length - 1]
    if (!answerFlag) {
      Taro.showToast({
        title: '请先答完当前题目',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let oldData = JSON.parse(Taro.getStorageSync('testData'))
    this.indexArr.map((item, i) => {
        oldData[item] = this.answerArr[i]
    })
    let params ={
      id: this.state.id,
      fdAnswer: JSON.stringify(oldData)
    }
    Taro.showLoading({
      title: '加载中'
    })
    request({
      method: 'POST',
      url: '/admin2/questionAccount/saveResult',
      data: params
    }).then(resp => {
      const data = resp.data
      if (data.code == 1) {
        Taro.reLaunch({
          url: '/pages/test/end'
        })
      } else {
        Taro.showToast({
          icon: 'none',
          title: data.content
        })
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }

  render () {
    let TestData = this.state.testData
    return (
      <View className='testBox'>
        <View className='hd'>
          <Text>DISC性格测试</Text>
        </View>
        <View className='bd' >
          <View className='bd-wrap' animation={this.state.animationData}>
          {
            TestData.map((item, index) => {
              let activeFlag = this.state.pageIndex == (index + 1 )
              return (
                <View className={['tbox', activeFlag ? 'active' : '']} key={index} >
                  <View className='tbox-wrap'>
                    
                    <Item onChange={this.shandle.bind(this)} itemData={item} index={index} onswiper={this._swiper.bind(this)}/>
                    <View className='btns'>
                    {
                      index+1 == TestData.length?
                      <Button  className='btn' onClick={this._submit.bind(this)}>提交</Button>
                      :<Button  className='btn' onClick={this._nextTest.bind(this, index+1, false)}>下一题</Button>
                    }
                      {/* <Button  className='btn' onClick={this._submit.bind(this, index+1)}>提交</Button> */}
                    </View>
                  </View>
                </View>
              )
            })
          }
          </View>
        </View>
        <View className='ft'>
          <Text>{this.state.pageIndex}/{this.state.testData.length}</Text>
        </View>
      </View>
    )
  }
}