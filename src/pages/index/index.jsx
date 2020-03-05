import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '../../api/index'

import './index.scss'

import bgImg from "../../assets/image/home-bg-fill.png";
import namedlogo from "../../assets/image/home-logo.png";
import nametit from "../../assets/image/home-img-tizhi.png";
// import wor3Img from "../../assets/image/home-img-wor3.png";
import butStaImg from "../../assets/image/home-but-sta.png";

class Index extends Component {

  config = {
    navigationBarTitleText: '体质测试'
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      avatar: "",
      country: "",
      province: "",
      nickname: "",
      gender: "",
      isAuthorization: true,
      isGet: false,
      js_code: "",
      jsData: {},
      errText: "",
      //错误提示
      errToast: false,
      //错误提示状态
      is_docktor: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    let that = this;
    Taro.login().then(res => {
      let params = { js_code: res.code };
      that.setState({ js_code: res.code });

      api.register(params).then((res) => {
        if (res.data.code === 200) {
          let token = res.data.data.sessionKey;
          that.setState({
            jsData: res,
            //is_docktor: result.data.data.is_docktor
          });
          that.isCanGetUserInfo();
          Taro.setStorageSync("token", token);
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

  componentDidShow() { }

  componentDidHide() { }

  getUserInfo = (userInfo) => {
    /**
     * 返回结果有两种
     * 1.拒绝  errMsg:"getUserInfo:fail auth deny"
     * 2.接受  errMsg:"getUserInfo:ok"
     */
    if (userInfo.detail.errMsg === "getUserInfo:ok") {
      this.updateUserInfo(userInfo.detail);
      this.setState({
        isAuthorization: true
      });
    }
  };

  answerGuide = () => {
    Taro.navigateTo({
      url: "/pages/physicalList/physicalList"
    });
  };

  isCanGetUserInfo() {
    var that = this;
    try {
      const value = Taro.getStorageSync('token');
      if (value) {
        that.setState({
          isGet: true,
          isAuthorization: true
        });
      } else{
        Taro.getUserInfo({
          success: function success(res) {
            that.setState({isGet: true});
            that.updateUserInfo(res);
          },
          fail: function fail(res) {
            that.setState({
              isAuthorization: false
            });
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  }

  updateUserInfo(res) {
    api.udpateWxUserInfo(res.userInfo);
  }

  beginTest() {
    Taro.navigateTo({
      url: "/pages/question/question"
    });
  }

  resultsTest() {
    var that = this;
    api.result().then(function (res) {
      if (res.data.code === 200) {
        var id = res.data.msg.yusercs_id;
        Taro.navigateTo({
          url: "/pages/sharesuccess/sharesuccess?id=" + id
        });
      } else {
        that.setState({
          errText: "还没有可查看的结果，请先去测试！",
          errToast: true
        });
      }
    });
  }

  onShareAppMessage(res) {
    return {
      title: "体质测试",
      path: "pages/index/index",
      imageUrl: api.imageUrl + "res-img-rep.png",
      success: function success(res) { }
    };
  }

  render() {
    return (
      <View className='container' style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "100%" }}>
        <View className='tizhiceshi'><Image className='tizhiceshiImg' src={nametit}></Image></View>
        {/* <View className="content" style={{backgroundImage: `url(${wor3Img})`,backgroundSize: "100% 100%",marginTop: "11%"}}> */}
        <View className='content' style={{ backgroundSize: "100% 100%", marginTop: "11%" }}>
          <View className='contentText'>本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过了<Text style={{ fontWeight: "bold" }}>30,000,000</Text>人，被医知TV的用户誉为<Text style={{ fontWeight: "bold" }}>超准中医体质测试</Text></View>
          <View className='contentTextFoot'>为保证测试精准度，请耐心填写</View>
        </View>
        <View onClick={this.beginTest} className='add_btn' data-e-tap-so='this' style={{ background: `url(${butStaImg})`, backgroundSize: "100%" }}><Text className='ceshiBTN'>开始测试</Text></View>
        <View onClick={this.answerGuide} className='results_btn' hidden={this.state.is_docktor!== 1}><Text className='results_btn_text'>体质列表</Text></View>
        <View className='logo'><Image src={namedlogo} style={{ width: "82px", height: "25px" }}></Image></View>

        <View className='mask' hidden={this.state.isAuthorization}>
          <View className='infoContainer'>
            <View style={{ marginLeft: "10px", marginTop: "20px" }}>欢迎来到体质测试小程序</View>
            <View>申请获取你的公开信息（昵称、头像等）</View>
            <Button openType='getUserInfo' onGetUserInfo={this.getUserInfo} style={{ width: "100px", height: "30px", fontSize: "15px", lineHeight: "30px", marginTop: "20px" }}>微信授权</Button>
          </View>
        </View>
        <AtToast __triggerObserer="{_triggerObserer}" duration={2000} hasMask={false} isOpened={this.state.errToast} text={this.state.errText}></AtToast>
      </View>
    )
  }
}

export default Index
