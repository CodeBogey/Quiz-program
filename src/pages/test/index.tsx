import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
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
    this.timer = '' // 计时器容器
    this.domWidth = 0
    this.animation = Taro.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    // this.answerArr = new Array(40)
    this.answerArr = []
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
    }, ()=>{
      if (this.timer) clearInterval(this.timer)
      setTimeout(() => {
        this._countDown()
      }, 300)
    })
   
  }
  
  componentWillMount() {
    Taro.showLoading({
      title: '加载中',
    })
  }

  componentDidMount () {
    // console.log('TestData', TestData)
    if (this.$router.params && this.$router.params.id) {
      let id = this.$router.params.id
      this.setState({
        id
      })
    }
    this._getListData()
  }

  _swiper () {
     // 获取dom节点的宽度
     var query = Taro.createSelectorQuery()
     query.select('.tbox').boundingClientRect(rect => {
       this.domWidth =  rect.width/1.05
       // console.log('rect.width', this.domWidth)
     }).exec()
     this._countDown()
  }
  
  _getListData () {
    request({
      method: 'GET',
      url: '/admin2/question/characterList',
    }).then(resp => {
      let data = resp.data
      console.log('data', data)
      this.setState({
        testData: data
      })
    })
  }

  _countDown () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    var step = 1,//计数动画次数
    num = 0,//计数倒计时秒数（n - num）
    start = 1.5 * Math.PI,// 开始的弧度
    end = -0.5 * Math.PI,// 结束的弧度

    var animation_interval = 1000,// 每1秒运行一次计时器
    n = 15; // 当前倒计时为10秒
    const _this = this
    function animation () {
      if (step <= n) {
        end = end + 2 * Math.PI / n;
        ringMove(start, end);
        step++;
        if ( n-num < 0) {
          _this._nextTest(_this.state.pageIndex, true)
        }
      } else {
        clearInterval(this.timer);
      }
    }
    function ringMove (s, e) {
      var context = Taro.createCanvasContext('secondCanvas')

      // 绘制圆环
      context.setStrokeStyle('#ab75ff')
      context.beginPath()
      context.setLineWidth(3)
      context.arc(20, 20, 16, s, e, true)
      context.stroke()
      context.closePath()
      
      // 绘制倒计时文本
      context.beginPath()
      context.setLineWidth(1)
      context.setFontSize(12)
      context.setFillStyle('#7319ff')
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      context.fillText(n - num + 's', 20, 20, 40)
      context.fill()
      context.closePath()

      context.draw()

      // 每完成一次全程绘制就+1
      num++;
    }
    ringMove(start, end);
    // 创建倒计时
    this.timer = setInterval(animation, animation_interval)
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
    let params ={
      id: this.state.id,
      fdAnswer: JSON.stringify(this.answerArr)
      // id: "166a908f6c0b5670e6954f54740b2ac0",
      // fdAnswer: '[{"id":"1669ad6011741f06b21dec34d05a615e","answer":"I"},{"id":"1669ad60128a11773c9f6d041f48b8a9","answer":"I"},{"id":"1669ad60133c4b72b587d7d414f94f4a","answer":"I"},{"id":"1669ad6013f3ad8f337db6a4daa9ca95","answer":"S"},{"id":"1669ad6014cb69490400cba411fa6d20","answer":"S"},{"id":"1669ad60158802795b3bb144296b11fc","answer":"C"},{"id":"1669ad60168f989c9fc12c84fa2ac68d","answer":"I"},{"id":"1669ad60177d6d35e9dcb524154991c7","answer":"C"},{"id":"1669ad601922690d113481f4a4e83103","answer":"C"},{"id":"1669ad601aeaf7298976f8e4e138576e","answer":"I"},{"id":"1669ad601c9feb077af92a24952995af","answer":"I"},{"id":"1669ad6023f570fae92f4e446be977b2","answer":"I"},{"id":"1669ad60272a2c5bb1797c44a968c99c","answer":"I"},{"id":"1669ad60284568556822eca4a41850dc","answer":"D"},{"id":"1669ad602a71cec807c3a5442d2b0f4b","answer":"C"},{"id":"1669ad602d77e635afa720b497982ab1","answer":"C"},{"id":"1669ad602f0b85c6ef59be6438fa842f","answer":"D"},{"id":"1669ad60316621377366a2141cdb26b4","answer":"S"},{"id":"1669ad6032eef7829befe51433eb9596","answer":"D"},{"id":"1669ad60352ea0b213e7917460d88e1a","answer":"S"},{"id":"1669ad60379da9db29b4bb744528c71a","answer":"D"},{"id":"1669ad6038f6ba828d5451740a688069","answer":"S"},{"id":"1669ad6042808dfbe3801404f23adfac","answer":"D"},{"id":"1669ad6043954858814e2724053abcce","answer":"I"},{"id":"1669ad60450006941434d0649de9e1f7","answer":"D"},{"id":"1669ad6046f5fe3da4b1c7948d09563b","answer":"D"},{"id":"1669ad6048c85a011ab90f64749803a6","answer":"C"},{"id":"1669ad6049a485aed566886453bbbea3","answer":"S"},{"id":"1669ad604aa5b27c632240f4d2ba0bd1","answer":"C"},{"id":"1669ad604b49084e6bac1a84cabbcbe5","answer":"D"},{"id":"1669ad604c0a250beb6f70142b9a692e","answer":"I"},{"id":"1669ad604cdc0107a9a653c4f388c3de","answer":"I"},{"id":"1669ad604dd72095d8f80eb43c1bf6dd","answer":"D"},{"id":"1669ad604ff02141bf411094756b954e","answer":"S"},{"id":"1669ad6051ed2d6547ce652480aa87ec","answer":"C"},{"id":"1669ad6053d75fd7b2c2cf647be8c8d1","answer":"C"},{"id":"1669ad6056f90f9dd8b489b419d920e2","answer":"C"},{"id":"1669ad6057c51967311040e4ddc8695d","answer":"S"},{"id":"1669ad6058cfcb303868766420eba028","answer":"I"},{"id":"1669ad6059ab76feefbce3143f8ad765","answer":"I"}]'
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
                <View className={['tbox', activeFlag ? 'active' : '']} key={index} ref='tbox'>
                  <View className='tbox-wrap'>
                    <View className='time'>
                      {/* <Text>16s</Text> */}
                      {
                        activeFlag && 
                        <View className='countDown'>
                          <canvas style="width: 40px; height: 40px;transition: all 0.3s;" canvas-id={'secondCanvas'}></canvas>
                        </View>
                      }
                    </View>
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