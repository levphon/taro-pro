import Taro, {Component} from "@tarojs/taro";
import {Button, Image, Text, View} from '@tarojs/components'
import {AtToast, AtAccordion, AtList} from "taro-ui";
import api from "../../api";

import bgImg from "../../assets/image/home-bg-fill.png";

function setOption(chart, tzValue) {
  //首先定义一个数组
  var colorList = [];
  var option = {
    title: {
      //   text: '您的体质现状优于全国65%人',
      subtext: "单位（%）"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow"
      }
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: [{
      splitLine: {
        show: false
      },
      //去除网格线
      splitArea: {
        show: false
      },
      //保留网格区域
      boundaryGap: true,
      type: "category",
      data: ["气虚", "阳虚", "阴虚", "痰湿", "湿热", "血瘀", "气郁", "特禀"],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: "#999"
        }
      }
    }],
    yAxis: [{
      splitLine: {
        show: false
      },
      //去除网格线
      splitArea: {
        show: false
      },
      //保留网格区域
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#999"
        }
      }
    }],
    series: [{
      name: "体质图",
      type: "bar",
      barWidth: "60%",
      //显示每一条额数量
      label: {
        normal: {
          show: false,
          position: "top"
        }
      },
      data: tzValue,
      markArea: {
        data: [[{
          itemStyle: {
            borderColor: "rgb(114,152,227)",
            borderWidth: 2,
            borderType: "solid"
          },
          yAxis: "30"
        }, {
          yAxis: "30"
        }], [{
          itemStyle: {
            borderColor: "rgb(255,137,57)",
            borderWidth: 2,
            borderType: "solid"
          },
          yAxis: "40"
        }, {
          yAxis: "40"
        }]]
      },
      // markLine: {
      //   symbol: 'none',
      //   large: true,
      //   data: [
      //     [
      //       {
      //         itemStyle: {
      //           normal: {
      //             show: true,
      //             color: 'rgba(114,152,227,.5)',
      //             width: 2,
      //           }
      //         },
      //         lineStyle: {
      //           normal: {
      //             type: 'solid',
      //             color: 'rgba(114,152,227,.5)',
      //             width: 2,
      //           }
      //         },
      //         coord: [0, 30]
      //       },
      //       {
      //         coord: ['特禀', 30]
      //       }
      //     ],
      //     [
      //       {
      //         itemStyle: {
      //           normal: {
      //             show: true,
      //             color: 'rgba(255,137,57,.5)',
      //             width: 2,
      //           }
      //         },
      //         lineStyle: {
      //           normal: {
      //             type: 'solid',
      //             color: 'rgba(255,137,57,.5)',
      //             width: 2,
      //           }
      //         },
      //         coord: [0, 40]
      //       },
      //       {
      //         coord: ['特禀', 40]
      //       }
      //     ],
      //   ]
      // },
      itemStyle: {
        normal: {
          color: function color(params) {
            if (params.data >= 40) {
              colorList.push("#ff8939");
            } else if (params.data < 30) {
              colorList.push("#d2e0f7");
            } else if (30 <= params.data < 40) {
              colorList.push("#7298e3");
            }
            return colorList[params.dataIndex];
          },
          //以下为是否显示
          label: {
            show: true
          }
        }
      }
    }]
  };
  chart.setOption(option);
}

class ShareSuccess extends Component {
  config = {
    navigationBarTitleText: "结果生成中...",
    // 定义需要引入的第三方组件
    usingComponents: {
      "ec-canvas": "../../components/ec-canvas/ec-canvas"
    }
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      isRead: false,
      resulaData: [],
      firstData: {},
      lastData: [],
      tizhi: "",
      ftizhi: "",
      fbh: "",
      tzValue: [0, 23, 34, 34, 45, 56, 24, 0],
      errText: "",
      //错误提示
      errToast: false,
      //错误提示状态
      shareNumber: 0,
      //分享次数
      show: ""
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    var _this2 = this;
    var yusercs_id = this.$router.params.id;
    // const yusercs_id = 1975;
    var that = this;
    Taro.showLoading.showLoading({title: "加载中"});
    api.result({
      yusercs_id: yusercs_id
    }).then(function (res) {
      if (res.data.code === 100) {
        Taro.hideLoading();
        that.setState({
          tizhi: res.data.msg.user_data.final_tz_name,
          fbh: res.data.msg.report.fbh,
          ftizhi: res.data.msg.user_data.jianyou_tz,
          resulaData: res.data.msg.report.group["分享"],
          tzValue: res.data.msg.tz_value,
          show: res.data.show
        });
        var title = "您的体质是" + res.data.msg.report.fmc;
        Taro.setNavigationBarTitle({title: title});

        _this2.$scope.selectComponent("#mychart-dom-area").init(function (canvas, width, height) {
          // 获取组件的 canvas、width、height 后的回调函数
          // 在这里初始化图表
          var chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          setOption(chart, _this2.state.tzValue);
          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          _this2.chart = chart;
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        });
      }
    }).catch(function (error) {
      // console.log(error);
    });
  }

  onRead = () => {
    this.setState({
      isRead: !this.state.isRead
    });
  };

  onAgain = () => {
    Taro.redirectTo({
      url: "/pages/question/question"
    });
  };

  payLed = () => {
    //let yusercs_id = this.$router.params.id;

    //获取数据
    let that = this;
    Taro.redirectTo({
      url: "/pages/accessToReport/accessToReport?fbh=" + that.state.fbh + "&value=" + that.state.tizhi
    });
  };

  toReport = () => {
    Taro.redirectTo({
      url: "/pages/report/report?fbh=" + this.state.fbh
    });
  };

  onShareAppMessage = (res) => {
    var that = this;
    var tizhi = this.state.tizhi;
    var yusercs_id = this.$router.params.id;
    api.shareBtn({
      yusercs_id: yusercs_id
    }).then(function (res) {
      that.setState({
        errToast: true,
        errText: "分享成功",
        shareNumber: res.data.data.num
      });
    }).catch(function (error) {
      // console.log(error);
    });
    return {
      title: "准！原来我是" + tizhi + "体质！你是什么体质？快来测试吧！",
      path: "pages/index/index",
      success: function success(res) {
      }
    };
  };

  render() {
    const {tizhi} = this.state;
    const {ftizhi} = this.state;
    const {isRead} = this.state;
    const {resulaData} = this.state;

    let gimg = "/pages/image/res-icon-esc.png";
    return (
      <View className='wrapper' style={{backgroundImage: `url(${bgImg})`, backgroundSize: "100%"}}>
        <View className='answer'>
          <Text className='system'>您的体质：{tizhi}</Text>
          <Text className='system_item'>{ftizhi}</Text>
        </View>
        <View className='echarts'>
          <ec-canvas canvas-id='mychart-area' ec={this.state.ec} id='mychart-dom-area' />
        </View>
        <View className='blank' />
        <View className='result_wrapper'>
          <View style={{height: "50px", lineHeight: "50px"}}>
            <View style={{display: "inline-block"}}>
              <Image src={gimg} style={{
                width: "21px",
                height: "21px",
                marginRight: "8px",
                marginLeft: "8px",
                verticalAlign: "middle"
              }}
              />
              <Text className='result_text'>体质结果说明</Text>
              <Text bindtap='onRead' className='read_text' data-e-tap-so='this'>点击阅读</Text>
            </View>
            <View bindtap='onAgain' className='retest_wrapper' data-e-tap-so='this'>
              <text style={{fontSize: "15px", color: "#6999E4"}}>重新测试</text>
            </View>
          </View>
          <View style={{marginRight: "15px", marginLeft: "15px"}} hidden={!isRead}>
            <Text style={{
              color: "#333",
              fontSize: "15px",
              lineHeight: "23px",
              display: "block"
            }}
            >1.本测试来自《中医体质分类与判定》，这是中华中医药学会与2000年4月9日颁布的国家标准。</Text>
            <Text style={{
              color: "#333",
              fontSize: "15px",
              lineHeight: "23px",
              display: "block"
            }}
            >2.多种体质并存是多数人的状态。不必过于担心，调整生活方式是有改变的可能的。根据你独特的情况，我们推荐你首先改善气郁质，其他体质也会逐渐改善。</Text>
          </View>
          <View hidden={isRead} />
        </View>
        <View className='question'>
          {resulaData.map((item, index) => {
            return (<AtAccordion icon={item.fimage} title={item.ftitle} hidden={item.fxh !== 1}>
              <AtList>
                <View style={{color: "#6999E4", size: "20"}}>
                  <Text className='answer_text'>{item.fdesc}</Text>
                </View>
              </AtList>
            </AtAccordion>)

// <AtAccordion icon={item.fimage} title={item.ftitle} hidden={item.fxh!==2}>
// <AtList>
// <View style={{item}}><Text className="answer_text">{{item[$original].fdesc}}</Text>
// </View>
// </AtList>
// </AtAccordion>
// <AtAccordion  icon="{{item[$loopState__temp18]}}"
// title="{{item[$original].ftitle}}" wx:if="{{item[$original].fxh!==4}}">
// <AtList>
// <View style={{padding: "15px"}}>
// <Text className="answer_text">{{item[$original].fdesc}}</Text>
// </View>
// </AtList>
// </AtAccordion>

          })}
        </View>
        <View className='question questions'>
          <AtAccordion icon={{value: "playlist", color: "#6999E4", size: "20"}} open title='你的专属调理方案'>
            <AtList __triggerObserer='{{_triggerObserer}}'>
              <View className='quesionTitle'>
                <Text>添加中医老师</Text>
                <Text>获取调理报告</Text>
              </View>
              <Image src="{{imageUrl+'res-img-rep.png'}}" style={{
                width: "286.5px",
                height: "250px",
                marginTop: "35px",
                paddingLeft: "7%"
              }}
              />
              <View className='buyBtnDouble'>
                <View bindtap='payLed' className='buybuttom butheight' data-e-tap-so='this' wx:if='{{show===1}}'>
                  <Text>获取报告</Text>
                </View>
                <View className='sharebutton'>
                  <Button bindshareappmessage='onShareAppMessage' className='shareBtn' data-e-shareappmessage-so='this' openType='share'>把测试分享给你关心的人吧</Button>
                </View>
              </View>
            </AtList>
          </AtAccordion>
        </View>
        <AtToast duration='{{700}}' hasMask='{{false}}' isOpened='{{errToast}}' text='{{errText}}'/>
      </View>
    )
  }
}
