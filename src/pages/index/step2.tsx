import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Input, Button } from '@tarojs/components'


import './index.scss'
import request from '../../request'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '准备考试'
  }
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      phone: '',
      activeFlag: false,
      fdResourceId: '',
      fdIsUsing: ''
    }
  }

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
        let id = resp.data.id
        Taro.reLaunch({
          url: `/pages/test/index?id=${id}`
        })
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
    if (this.$router.params && this.$router.params.scene) {
      let params = this.$router.params
      this.setState ({
        fdResourceId: params.scene
      })
      this._judge(params.scene)
    }
  }
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
  render () {
    return (
      <View className='vbox'>
        <View className='sbox'>
          <View className='swipe-box'>
            <View className='ibox ibox2'>
              <View className='hd'>
                <View className='t'>
                  <Text>考前准备...</Text>
                </View>
                <View className='inputs'>
                  <Input placeholder='请输入您的姓名'  value={this.state.name} onInput={this._inputChange}/>
                  <Input placeholder='请输入您的手机号' value={this.state.phone}  onInput={this._inputChange2} />
                </View>
                <View className='img'>
                  <Image src={require('../../assets/images/bg2.png')} />
                </View>
                <View className='startBox'>
                  <Button className={['btn', this.state.activeFlag?'active':'']} onClick={this._startTest.bind(this)}>开始考试</Button>
                </View>
              </View>
              <View className='bd'>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

