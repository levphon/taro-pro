import Taro, {Component} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import api from '../../api/index'

import './question.scss'

import bgImg from "../../assets/image/home-bg-fill.png";
import ansImg from "../../assets/image/ans-icon-sub.png";
import {AtFloatLayout, AtProgress, AtToast} from 'taro-ui';

export default class Question extends Component {
  config = {
    navigationBarTitleText: '超准中医体质测试'
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      questionList: [],
      // 所有问题列表
      waitList: [],
      // 当前待回答列表
      isOpened: false,
      //答题指导状态
      show: false,
      fsl: 100,
      fwcsl: 1,
      pageSize: 1,
      //错误提示状态
      percent: "",
      //答题百分比
      sex: '',
      // 性别
      age: '',
      // 年龄段
      isOnClick: true,
      sexList: [{sex: "1", value: "男"}, {sex: "2", value: "女"}],
      ageList: [{age: "1", value: "18-25"}, {age: "2", value: "26-35"}, {age: "3", value: "36-45"}, {
        age: "4",
        value: "46-55"
      }, {age: "5", value: "56-65"}],
      errText: "",
      //错误提示
      errToast: false,
    };
  }

  componentDidMount() {
  }

  ageList = (age) => {
    this.setState({
      age: age
    }, function () {
      return this.begin();
    });
  };

  sexList = (sex) => {
    this.setState({
      sex: sex
    }, function () {
      return this.begin();
    });
  };

  begin = () => {
    let that = this;
    let sex = that.state.sex;
    let age = that.state.age;
    if (sex === "" || age === "") {
      return;
    }

    Taro.showLoading({title: "加载中"});
    let params = {
      gender: sex,
      age: age,
      pageNum: that.state.fwcsl,
      pageSize: that.state.pageSize
    };
    api.ykt(params).then(function (res) {
      Taro.hideLoading();
      let resjson = res.data;
      if (resjson.code === 200) {
        // 这个需要再最后回答完成后，跳转到下一个页面传递用
        let fwcsl = that.state.fwcsl || 0;
        let fsl = resjson.total || 100;
        let percent = fwcsl / fsl * 100;

        let datalist = resjson.rows;
        let id = datalist[0].id;
        // 放待代替数据
        let alllist = datalist.slice(0);
        // 放所有数据
        // 过滤数据，只展示未回答的数据列表
        let waitList = [];
        let finishedlist = {};
        if (datalist) {
          datalist.map(function (element, index) {
            element.bhid = index;
            element.fda = 0;
            if (element.fda === 0) {
              waitList.push(element);
            } else {
              finishedlist[element.id] = element.fda;
              // 完成数据记录
            }
          });
        }
        that.setState({
          id: id,
          questionList: alllist,
          waitList: waitList,
          waitItem: waitList[0],
          finishedlist: finishedlist,
          fsl: fsl,
          fwcsl: fwcsl,
          // fwcsl: waitList[0].bhid,
          percent: percent
        });
      }
    }).catch(function (error) {
      console.error(error);
      Taro.hideLoading();
      that.setState({
        errText: "服务器异常，请稍后重试",
        errToast: true
      });
    });
  };

  select = (item, optionId) => {
    let questionId = item.id;
    let that = this;
    let _this$state2 = this.state,
      id = _this$state2.id,
      fwcsl = _this$state2.fwcsl,
      fsl = _this$state2.fsl,
      questionList = _this$state2.questionList,
      waitList = _this$state2.waitList,
      finishedlist = _this$state2.finishedlist,
      isOnClick = _this$state2.isOnClick;
    // 参数
    let params = {
      qId: item.id,
      qoIds: [optionId]
    };
    if (!isOnClick) {
      return;
    } else {
      this.setState({
        isOnClick: false
      });
    }
    api.yktAnswer(params).then(function (res) {
      // 如果成功开始跳转到下一题
      let resjson = res.data;
      let code = resjson.code;
      // debugger
      if (code === 200) {
        // 完全回答正确，需要计数
        let fwczsl = void 0;
        // 待答题列表进行过滤
        let finishedKey = Object.keys(finishedlist);
        // waitlist.filter( (wait) => finishedKey.indexOf(wait.id+'') >=0 )
        // 如果是从列表中选择的，而且是已经打过的，下一题的计算需要调整
        if (finishedKey.indexOf(questionId + "") >= 0) {
          // 已经答过题了
          // 从待答题列表中删除
          fwczsl = fwcsl;
          //下一题还是当前待答题的数据
          // next = step
        } else {
          // next = step + 1
          finishedlist[questionId] = optionId;
          finishedKey.push(questionId);
          fwczsl = fwcsl + 1;
        }
        //console.log(fwczsl);
        //console.log(finishedKey);

        that.questionNext(fwczsl);

        let waitItems = [];
        waitList.forEach(function (element) {
          if (finishedKey.indexOf(element.id) < 0) {
            waitItems.push(element);
          }
        });
        // fwczsl = waitItems[0].bhid;
        let percent = fwczsl / fsl * 100;
        let msg = resjson.msg;
        that.setState({
          fwcsl: fwczsl,
          isOpened: false,
          waitList: waitItems,
          waitItem: waitItems[0],
          finishedlist: finishedlist,
          percent: percent,
          questionList: questionList,
          errText: msg,
          errToast: true,
          isOnClick: true
        });
      } else if (code === 100) {
        // 所有考题答完,把id 传递到下一个页面
        Taro.redirectTo({
          url: "/pages/sharesuccess/sharesuccess?id=" + id
        });
      } else if (resjson.code === -100) {
        let _msg = resjson.msg;
        that.setState({
          errText: _msg,
          errToast: true
        });
      }
    }).catch(function (error) {
      console.error(error);
      that.setState({
        errText: "服务器异常，请稍后重试",
        errToast: true
      });
    });
  };

  questionNext(pageNum) {
    let that = this;
    let finishedlist = that.state.finishedlist;
    Taro.showLoading({title: "加载中"});
    let params = {
      gender: that.state.sex,
      age: that.state.age,
      pageNum: pageNum,
      pageSize: that.state.pageSize
    };
    api.ykt(params).then(function (res) {
      Taro.hideLoading();
      let resjson = res.data;
      if (resjson.code === 200) {
        let datalist = resjson.rows;

        if (datalist && datalist.length <= 0) {
          // 所有考题答完,把id 传递到下一个页面
          Taro.redirectTo({
            url: "/pages/sharesuccess/sharesuccess?id=" + that.state.id
          });
        }

        // 这个需要再最后回答完成后，跳转到下一个页面传递用
        let fwcsl = pageNum || 0;
        let fsl = resjson.total || 100;

        let id = datalist[0].id;
        // 放待代替数据
        let alllist = datalist.slice(0);
        // 放所有数据
        let percent = fwcsl / fsl * 100;
        // 过滤数据，只展示未回答的数据列表
        let waitList = [];
        if (datalist) {
          datalist.forEach(element => {
            waitList.push(element);
          });
        }
        that.setState({
          id: id,
          questionList: alllist,
          waitList: waitList,
          waitItem: waitList[0],
          finishedlist: finishedlist,
          fsl: fsl,
          // fwcsl: waitList[0].id,
          percent: percent
        });
      }
    }).catch(function (error) {
      console.error(error);
      Taro.hideLoading();
      that.setState({
        errText: "服务器异常，请稍后重试",
        errToast: true
      });
    });
  }

  jumpQuestion = (index) => {
    let questionList = this.state.questionList;
    this.setState({
      waitItem: questionList[index],
      show: false,
      fwcsl: index,
      fwczsl: index
    });
  };

  questionAllList = () => {
    this.setState({
      show: true,
      errToast: false
    });
  };

  answerGuide = () => {
    this.setState({
      isOpened: true
    });
  };

  handleClose = () => {
    this.setState({
      isOpened: false
    });
  };

  onClose = () => {
    this.setState({
      show: false
    });
  };

  render() {
    let currentStyleY = {
      backgroundColor: "#6999E4",
      color: "#fff"
    };
    let currentStyleN = {
      backgroundColor: "#fff",
      color: "#6999E4"
    };
    const {percent} = this.state;
    const {sex} = this.state;
    const {age} = this.state;
    const {fwcsl} = this.state;
    const {fsl} = this.state;
    const {waitItem} = this.state;
    const {show} = this.state;
    const {isOpened} = this.state;
    const {sexList} = this.state;
    const {ageList} = this.state;
    const {waitList} = this.state;
    const {questionList} = this.state;
    const {finishedlist} = this.state;
    return (
      <View className='index' style={{backgroundImage: `url(${bgImg})`, backgroundSize: "100%"}}>
        <View className='proCon' hidden={sex === '' || age === ''}>
          <Text className='proNum'>{fwcsl == 0 ? 1 : fwcsl}</Text>
          <AtProgress __triggerObserer='{triggerObserer}' className='progress' color='#00ff00' isHidePercent
                      percent={Number(percent)} sttus='progress'
          ></AtProgress>
          <Text className='proNum'>{fsl}</Text>
        </View>
        <View className='content'>
          <View className='contentText'>本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过<Text
            style={{fontWeight: "bold"}}
          >30,000,000</Text>人，被医知TV的用户誉为<Text style={{fontWeight: "bold"}}>超准中医体质测。</Text>
          </View>
          <View className='contentTextFoot'>为保证测试精准度，请耐心填写</View>
        </View>
        <View className='center'>
          <View hidden={sex !== '' && age !== ''}>
            <View className='centerFirst'>
              <View className='centerTextTitle' style={{backgroundImage: `url(${ansImg})`, backgroundSize: "100%"}}>
                <Text className='biaoTitle'>必答题</Text>
              </View>
              <View className='centerTextSex'>
                <Text className='firstQuestion'>请问您的性别是？</Text>
              </View>
              <View className='centerTextAnswer'>
                {sexList.map((item, index) => {
                  return (<Text onClick={this.sexList.bind(this, item.value)} className='answer' key={item.sex}
                                data-e-tap-a-a={item.sex} data-e-tap-so={this}
                                style={sex === item.value ? currentStyleY : currentStyleN}>{item.value}</Text>)
                })}
              </View>
              <View className='centerTextSex'>
                <Text className='firstQuestion'>请问您的年龄是？</Text>
              </View>
              <View className='centerTextAnswer'>
                {ageList.map((item, index) => {
                  return (<Text onClick={this.ageList.bind(this, item.value)} className='answer' key={item.age}
                                data-e-tap-a-a={item.age} data-e-tap-so={this}
                                style={age === item.value ? currentStyleY : currentStyleN}
                  >{item.value}</Text>)
                })}
              </View>
            </View>
          </View>
          <View className='centerFirsts' hidden={waitItem == null}>
            <View hidden={waitItem.question == ''}>
              {waitList.map((items, indexs) => {
                return (
                  <View key={items.id}>
                    <View className='centerTextTitle'
                          style={{backgroundImage: `url(${ansImg})`, backgroundSize: "100%"}}
                    >
                      <Text className='biaoTitle'>第{fwcsl + 1}题</Text>
                    </View>
                    <View className='centerTextQuestion'>
                      <Text className='firstQuestion'>{items.question}</Text><Text className='firstQuestion'
                                                                                   hidden={items.remark === '' || items.remark === 'null'}
                    >({items.remark})</Text>
                      <View className='centerTextAnswer' hidden={!items.options}>
                        {items.options.map((itemss, indexss) => {
                          console.log(items);
                          return (<Text onClick={this.select.bind(this, waitItem, itemss.id)} className='answer'
                                        data-e-tap-a-a={waitItem} data-e-tap-a-b={itemss.id}
                                        data-e-tap-a-c={itemss.question_id} data-e-tap-so={this} key={indexss}
                                        style={finishedlist[waitItem.id] === itemss.question_id ? currentStyleY : currentStyleN}
                          >{itemss.option}</Text>)
                        })}
                      </View>
                    </View>
                  </View>)
              })}
            </View>
          </View>
        </View>

        <View onClick={this.questionAllList} className='questionAllList' hidden={sex === '' || age === ''}>
          <Text className='questionAllListText'>查看题目</Text>
        </View>
        <AtFloatLayout onClose={this.onClose} data-e-onclose-so='this' isOpened={show} title='查看题目'>
          <View className='lookViewAnswer'>
            {questionList.map((item, index) => {
              return (<Text onClick={this.jumpQuestion} className='lookAnswer' key={index} data-e-tap-a-a={index}
                            data-e-tap-so='this'
                            style={Object.keys(finishedlist).indexOf(item.id + "") >= 0 ? currentStyleY : currentStyleN}>{index + 1}</Text>)
            })}
          </View>
        </AtFloatLayout>

        <View onTouchEnd={this.answerGuide} className='answerGuide'>
          <Text className='answerGuideText'>答题指导</Text>
        </View>
        <AtFloatLayout onClose={this.handleClose} isOpened={isOpened} title='答题指导（根据最近三个月的情况选择）'>
          <View className='laycontainer'>
            <View className='layView'>
              <Text className='layAnswerTitle'>没有：</Text>
              <Text className='layAnswerCon'>根本不，似乎没有发生过.</Text>
            </View>
            <View className='layView'>
              <Text className='layAnswerTitle'>很少：</Text>
              <Text className='layAnswerCon'>好像有，很偶然，没必要放心上。</Text>
            </View>
            <View className='layView'>
              <Text className='layAnswerTitle'>有时：</Text>
              <Text className='layAnswerCon'>偶尔有，没什么规律，有点担心。</Text>
            </View>
            <View className='layView'>
              <Text className='layAnswerTitle'>经常：</Text>
              <Text className='layAnswerCon'>是，有这个现象，有点规律。</Text>
            </View>
            <View className='layView'>
              <Text className='layAnswerTitle'>总是：</Text>
              <Text className='layAnswerCon'>是，一直困扰我。</Text>
            </View>
          </View>
        </AtFloatLayout>
        <AtToast duration={700} hasMask={false} isOpened={this.state.errToast} text={this.state.errText}/>
      </View>
    )
  }
}
