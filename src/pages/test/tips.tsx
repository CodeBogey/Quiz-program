import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

export default class Tips extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  _goOn () {
    Taro.reLaunch({
      url: `/pages/test/unAnswer?data=${this.props.unAnswerData}`
    })
  }
  render () {
    return (
      <View className='cover'>
        <View className='box'>
          <View><Image className='img' src={require('../../assets/images/icon_cover.png')}/></View>
          <View  className='txts'><Text>刚刚有</Text><Text className='strong'>{this.props.unAnswerLength}</Text><Text>题因超时未作答</Text></View>
          <Text className='txt'>请点击下方按钮</Text>
          <Text className='txt'>继续完成测试</Text>
          <Button className='btn' onClick={this._goOn.bind(this)}>继续测试</Button>
        </View>
      </View>
    )
  }
}
