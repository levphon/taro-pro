import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '../../api/index'

import 'taro-ui/dist/style/index.scss'
import './index.scss'

import namedlogo from "../../assets/image/home-logo.png";
import nametit from "../../assets/image/home-img-tizhi.png";

class Index extends Component {

  config = {
    navigationBarTitleText: '体质测试'
  }

  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {
      name: "",
      avatar: "",
      country: "",
      province: "",
      nickname: "",
      gender: "",
      isAuthorization: false,
      isGet: false,
      js_code: "",
      jsData: {},
      errText: "",
      //错误提示
      errToast: false,
      //错误提示状态
      is_docktor: ""
    }

    this.isCanGetUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    var that = this;
    Taro.login().then(res => {    
      var params = { js_code: res.code };
      that.setState({ js_code: res.code });
      api.register(params).then((res) => {
        if (res.data.code === 100) {
          var token = res.data.data.token;
          Taro.setStorageSync("token", token);
          that.setState({
            jsData: res,
            is_docktor: result.data.data.is_docktor
          });
          that.isCanGetUserInfo();
        }
      });
    }).catch(err => {
      console.log(err);
      Taro.showToast({
        title: '发生错误，请重试!',
        icon: 'none'
      })
    });
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  isCanGetUserInfo() {
    this.getUserInfo({
      success: function success(res) {
        that.setState({
          isGet: true
        });
        that.updateUserInfo(res);
      },
      fail: function fail(res) {
        that.setState({
          isAuthorization: true
        });
      }
    });
  }

  updateUserInfo(res) {
    var isGet = this.state.isGet;
    api.udpateWxUserInfo(res.userInfo);
  }

  beginTest() {
    Taro.navigateTo({
      url: "/pages/question/question"
    });
  }

  resultsTest() {
    var that = this;
  }


  answerGuide = () => {
    Taro.navigateTo({
      url: "/pages/physicalList/physicalList"
    });
  }

  getUserInfo = (userInfo) => {
    /**
     * 返回结果有两种
     * 1.拒绝  errMsg:"getUserInfo:fail auth deny"
     * 2.接受  errMsg:"getUserInfo:ok"
     */
    // if (userInfo.detail.errMsg === "getUserInfo:ok") {
    //   _this.updateUserInfo(userInfo.detail);
    //   _this.setState({
    //     isAuthorization: false
    //   });
    // }
  }

  onShareAppMessage(res) {

  }

  render() {
    let answerGuideView = null;
    let authorizationView = null;
    if (this.state.is_docktor === 1) {
      answerGuideView = <View onClick={this.answerGuide} className="results_btn"><Text class="results_btn_text">体质列表</Text></View>;
    }
    if (this.state.isAuthorization) {
      authorizationView = <View className="mask">
        <View className="infoContainer">
          <View>欢迎来到体质测试小程序</View>
          <View>申请获取你的公开信息（昵称、头像等）</View>
          <Button openType='getUserInfo' onGetUserInfo={this.getUserInfo}>微信授权</Button>
        </View>
      </View>;
    } else {
      authorizationView = <View></View>;
    }

    return (
      <View className="container">
        <View className="tizhiceshi"><Image class="tizhiceshiImg" src={nametit}></Image></View>
        <View className="content">
          <View className="contentText">本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过了<Text>30,000,000</Text>人，被医知TV的用户誉为<Text>超准中医体质测试</Text></View>
          <View className="contentTextFoot">为保证测试精准度，请耐心填写</View>
        </View>
        <View onClick={this.beginTest} className="add_btn" data-e-tap-so="this"><Text class="ceshiBTN">开始测试</Text></View>
        {answerGuideView}
        <View class="logo"><Image src={namedlogo}></Image></View>
        {authorizationView}
        {/* <at-toast __triggerObserer={_triggerObserer} duration={2000} hasMask={false} isOpened={errToast} text={errText}></at-toast> */}
      </View >
    )
  }
}

export default Index