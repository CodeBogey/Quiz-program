import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Button } from '@tarojs/components'


import './index.scss'
import request from '../../request'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '准备测试'
  }
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      phone: '',
      activeFlag: false,
      fdResourceId: '',
      fdIsUsing: '',
      animationData: {},
      step: 0
    }
    this.animation = Taro.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.id = ''
    let _this = this
    Taro.getSystemInfo({
      success: res => {
        _this.screenWidth = res.screenWidth
      }
    })
  }
  // 开始考试
  _startTest () {
    if (!this.state.fdIsUsing && this.state.fdResourceId) {
      Taro.showToast({
        icon: 'none',
        title: '当前校招尚未开始',
      })
      return
    }
    // 用户名不能为空
    if (!this.state.name.trim()) {
      Taro.showToast({
        icon: 'none',
        title: '用户名不能为空'
      })
      return
    }
    // 手机号校验
    let phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/
    
    if (!phoneReg.test(this.state.phone)) {
      Taro.showToast({
        icon: 'none',
        title: '手机号格式不正确'
      })
      return
    }
    let params ={
      fdName: this.state.name,
      fdMobile: this.state.phone,
      fdResourceId: this.state.fdResourceId
    }
    Taro.showLoading({
      title: '加载中',
    })
    request({
      method: 'POST',
      url: '/admin2/questionAccount',
      data: params
    }).then(resp => {
      let data = resp.data
      Taro.hideLoading()
      if (data.id) {
        this.id = resp.data.id
        // Taro.reLaunch({
        //   url: `/pages/test/index?id=${id}`
        // })
        this._nextStep(2)
      } else {
        if (data.content) {
          Taro.showToast({
            icon: 'none',
            title: data.content
          })
        } else {
          Taro.showToast({
            icon: 'none',
            title: '数据异常，请联系管理员'
          })
        }
      }
      
    }).catch((err) => {
      Taro.hideLoading()
      if (err.response.data && err.response.data.content) {
        Taro.showToast({
          icon: 'none',
          title: err.response.data.content
        })
      } else {
        Taro.showToast({
          icon: 'none',
          title: '操作异常，请联系管理员'
        })
      }
    })
  }
  
  componentDidMount () {
    // 根据二维码的场景值判断是校招还是社招
    if (this.$router.params && this.$router.params.scene) {
      let params = this.$router.params // 获取场景值
      this.setState ({
        fdResourceId: params.scene
      })
      this._judge(params.scene)
    }
  }
  // 判断校招是否开始
  _judge (id) {
    request({
      method: 'POST',
      url: `/admin2/recruitJob/campusRecruitment/isStart/${id}`
    }).then(resp => {
      this.setState({
        fdIsUsing: resp.data.fdIsUsing
      })
    })
  }
  _inputChange (e) {
    this.setState({
      name: e.detail.value
    }, () => {
      this._activeHanle()
    })
  }
  _inputChange2 (e) {
    this.setState({
      phone: e.detail.value
    }, () => {
      this._activeHanle()
    })
  }
  // 手机号检验正确，按钮高亮
  _activeHanle () {
    let phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/
    if (this.state.name.trim() && phoneReg.test(this.state.phone)) {
      this.setState({
        activeFlag: true
      })
    } else {
      this.setState({
        activeFlag: false
      })
    }
  }
  // 控制下一步的动画效果
  _nextStep (i) {
    let w = this.screenWidth

    this.animation.translateX(-(w * i )).step()
    this.setState({
      animationData: this.animation.export(),
      step: i
    })
  }
  // 跳转到答题页面
  _startHandle () {
    let id = this.id
    Taro.reLaunch({
      url: `/pages/test/index?id=${id}`
    })
  }
  render () {
    let step2Flag = this.state.step == 1
    let step3Flag = this.state.step == 2
    return (
      <View className='vbox'>
        <View className='sbox'
        animation={this.state.animationData}
        >
          <View className='swipe-box'>
            <View className='ibox ibox1'>
              <View className='hd'>
                <View className='t'>
                  <View className='imgs-animate'>
                    <View className='wrap'>
                      <Image src={require('../../assets/images/ibox1_iocn1.png')} className='img img1'/>
                      <Image src={require('../../assets/images/ibox1_iocn2.png')} className='img img2'/>
                      <Image src={require('../../assets/images/ibox1_iocn3.png')} className='img img3'/>
                      <Image src={require('../../assets/images/ibox1_iocn4.png')} className='img img4'/>
                      <Image src={require('../../assets/images/ibox1_iocn5.png')} className='img img5'/>
                    </View>
                  </View>
                  <View className='text1'>
                    <Text>嘿，伙伴！</Text>
                    <Text>欢迎来到广而易,</Text>
                  </View>
                  <View className='text2'>
                    <Text>让我们来一场性格测试吧。</Text>
                  </View>
                  <View className='next'>
                    <Button className='btn' onClick={this._nextStep.bind(this, 1)}>下一步</Button>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='swipe-box'>
            <View className='ibox ibox2'>
              <View className='hd'>
                <View className='t'>
                  <Text>请填写以下信息</Text>
                </View>
                <View className='inputs'>
                  <Input placeholder='请输入您的姓名'  value={this.state.name} onInput={this._inputChange}/>
                  <Input placeholder='请输入您的手机号' value={this.state.phone}  onInput={this._inputChange2} />
                </View>
                 {
                  step2Flag && 
                  <View className='imgs-animate'>
                    <View className='wrap'>
                      <Image src={require('../../assets/images/ibox2_iocn1.png')} className='img img1'/>
                      <Image src={require('../../assets/images/ibox2_iocn2.png')} className='img img2'/>
                      <Image src={require('../../assets/images/ibox2_iocn3.png')} className='img img3'/>
                      <Image src={require('../../assets/images/ibox2_iocn4.png')} className='img img4'/>
                      <Image src={require('../../assets/images/ibox2_iocn5.png')} className='img img5'/>
                      <Image src={require('../../assets/images/ibox2_iocn6.png')} className='img img6'/>
                    </View>
                  </View>
                }
                <View className='startBox'>
                  <Button className={['btn', this.state.activeFlag?'active':'']} onClick={this._startTest.bind(this, 2)}>下一步</Button>
                </View>
              </View>
            </View>
          </View> 
          <View className='swipe-box '>
            <View className='ibox3'>
              <View className='hd'>
                {
                  step3Flag && 
                  <View className='imgs-animate'>
                    <View className='wrap'>
                      <Image src={require('../../assets/images/ibox3_iocn1.png')} className='img img1'/>
                      <Image src={require('../../assets/images/ibox3_iocn2.png')} className='img img2'/>
                      <Image src={require('../../assets/images/ibox3_iocn3.png')} className='img img3'/>
                      <Image src={require('../../assets/images/ibox3_iocn4.png')} className='img img4'/>
                      <Image src={require('../../assets/images/ibox3_iocn5.png')} className='img img5'/>
                      <Image src={require('../../assets/images/ibox3_iocn6.png')} className='img img6'/>
                      <Image src={require('../../assets/images/ibox3_iocn7.png')} className='img img7'/>
                    </View>
                  </View>
                }
                <View className='tips'>
                  <Image src={require('../../assets/images/ibox3_line.png')} className='img'/>
                  <Text>测试须知</Text>
                </View>
              </View>
              <View className='bd'>
                <View className='txt-box'>
                  <View>
                    <Text>1</Text>
                  </View>
                  <View>
                    <Text className='txt'>本测试为性格测试，结果没有优劣之分，</Text>
                    <Text className='txt'>请凭第一感觉，认真作答；</Text>
                  </View>
                </View>
                <View className='txt-box'>
                  <Text>2</Text>
                  <Text className='txt'>总共40题，每题均有20秒的作答时间；</Text>
                </View>
                <View className='txt-box'>
                  <View>
                    <Text>3</Text>
                  </View>
                  <View>
                    <Text className='txt'>若4个选项都很符合，请选出最贴切的选项，</Text>
                    <Text className='txt'>若4个选项都不符合，也选出比较贴切的选项；</Text>
                  </View>
                </View>
                <View className='txt-box'>
                  <Text>4</Text>
                  <Text className='txt'>每题均为单选，且必选。</Text>
                </View>
                <View className='txt-box'>
                  <Text>5</Text>
                  <Text className='txt'>大致需要12分钟，请勿中途退出答题页面。</Text>
                </View>
              </View>
              <View className='next'>
                <Button className='btn' onClick={this._startHandle.bind(this, 1)}>开始测试</Button>
              </View>
            </View>
          </View> 
        </View>
      </View>
    )
  }
}

