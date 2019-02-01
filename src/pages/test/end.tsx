/**
 * 考试结束页面
 */

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

export default class End extends Component {
  config = {
    navigationBarTitleText: '测试结束'
  }
  componentDidMount () {
    Taro.removeStorageSync('testData')
  }
  render () {
    return (
      <View className='dialog'>
        <View className='viewBox'>
          <Image className='img' src={require('../../assets/images/end.png')} />
        </View>
      </View>
    )
  }
}