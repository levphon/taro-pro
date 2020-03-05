// import '@tarojs/async-await'
import 'taro-ui/dist/style/index.scss'

import Taro, {Component} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'


import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/question/question',
      // 'pages/accessToReport/accessToReport',
      // 'pages/report/report',
      'pages/sharesuccess/sharesuccess',
      // 'pages/physicalList/physicalList'
    ],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#6999E4',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  };

  componentDidMount() {
    // Taro.getSetting()
    //   .then(res => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       return true;
    //     } else {
    //       throw new Error('没有授权')
    //     }
    //   })
    //   .then(res => {
    //     return Taro.getUserInfo();
    //   })
    //   .then(res => {
    //     Taro.setStorage({
    //       key: 'userInfo',
    //       data: res.userInfo
    //     })
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'));
