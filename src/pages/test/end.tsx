import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

export default class End extends Component {
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