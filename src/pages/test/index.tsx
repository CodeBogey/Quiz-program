import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
import Item from './item'
import request from '../../request'
import Tips from './tips'
export default class Test extends Component {
  config = {
    navigationBarTitleText: '开始测试'
  }
  constructor (props) {
    super(props)
    this.state = {
      animationData: {},
      pageIndex: 1,
      testData: [],
      id: '',
      tipFlag: false,
      unAnswerData: '',
      unAnswerLength: '',
      canvasFlag: true
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
  // 点击下一题按钮，事件处理
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
    if (this.$router.params && this.$router.params.id) {
      let id = this.$router.params.id
      this.setState({
        id
      })
    }
    this._getListData()
  }
  // 设置item的宽度
  _swiper () {
     // 获取dom节点的宽度
     var query = Taro.createSelectorQuery()
     query.select('.tbox').boundingClientRect(rect => {
       this.domWidth =  rect.width/1.05
       // console.log('rect.width', this.domWidth)
     }).exec()
     this._countDown()
  }
  // 获取题库
  _getListData () {
    request({
      method: 'GET',
      url: '/admin2/question/characterList',
    }).then(resp => {
      let data = resp.data
      this.setState({
        testData: data
      })
    })
  }
  // 倒计时动画
  _countDown () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    var step = 1,//计数动画次数
    num = 0,//计数倒计时秒数（n - num）
    start = 1.5 * Math.PI,// 开始的弧度
    end = -0.5 * Math.PI // 结束的弧度

    var animation_interval = 1000,// 每1秒运行一次计时器
    n = 20; // 当前倒计时为10秒
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

  // 答题
  shandle (item) {
    let params = {
      id: item.id,
      answer: item.answer
    }
    this.answerArr[item.index] = params
  }

  // 提交答题结果
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
    this.setState({
      canvasFlag: false
    })
    let dataArr = []
    this.answerArr.map((item, i) => { // 过滤出未答题的题目
      if (item.answer == '') {
        dataArr.push({
          msg: this.state.TestData[i],
          index: i
        })
      }
    })
    if (dataArr.length) { // 换成未答题的题目，方面第二轮考试拿到题库
      let data = {
        dataArr,
        id: this.state.id
      }
      data = JSON.stringify(data)
      this.setState({
        unAnswerData: data,
        tipFlag: true,
        unAnswerLength: dataArr.length
      })
      Taro.setStorageSync('testData', JSON.stringify(this.answerArr))
      return
    }
    let params ={
      id: this.state.id,
      fdAnswer: JSON.stringify(this.answerArr)
    }
    Taro.showLoading({
      title: '加载中'
    })
    // 全部答完直接结束
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
                    <View className='time'>
                      {
                        this.state.canvasFlag && activeFlag && 
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
        {
          this.state.tipFlag && <Tips unAnswerData={this.state.unAnswerData} unAnswerLength={this.state.unAnswerLength}/>
        }
      </View>
    )
  }
}