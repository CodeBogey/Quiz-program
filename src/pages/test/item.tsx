import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

export default class Item extends Component {
  constructor (props) {
    super(props)
    // console.log('props', this.props.itemData)
  }

  _selectHandle (item) {
    this.setState({
      selectFlag: item
    })
    let params = {
      id: this.props.itemData.id,
      answer: item,
      index: this.props.index
    }
    this.props.onChange(params)
  }

  componentDidMount () {
    Taro.hideLoading()
    this.props.onswiper()
  }
  render () {
    const itemData = this.props.itemData || []
    return (
      itemData.option.map((item, index) => {
        return (
          <View className='item' onClick={this._selectHandle.bind(this, item.value)} key={index}>
            <View className='title'><Text>{item.key.split('ï¼š')[0]}ï¼š</Text></View>
            <View className='content'><Text>{item.key.split('ï¼š')[1]}</Text></View>
            {
              this.state.selectFlag == item.value?
              <Image className='img' src={require('../../assets/images/select2.png')}/>
              :<Image className='img' src={require('../../assets/images/select.png')}/>
            
            }
          </View>
        )
      })
    )
  }
}