import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '../../api/index'

import './question.scss'

import bgImg from "../../assets/image/home-bg-fill.png";
import ansImg from "../../assets/image/ans-icon-sub.png";
import { AtFloatLayout, AtToast } from '_taro-ui@2.2.2@taro-ui'

class Question extends Component {
    config = {
        navigationBarTitleText: '超准中医体质测试'
    }

    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            questionList: [],
            // 所有问题列表
            waitList: [],
            // 当前待回答列表
            isOpened: false,
            //答题指导状态
            show: false,
            fsl: 100,
            fwcsl: 0,
            errText: "",
            //错误提示
            errToast: false,
            //错误提示状态
            percent: "",
            //答题百分比
            sex: '',
            // 性别
            age: '',
            // 年龄段
            isOnClick: true,
            sexList: [{
                sex: "1",
                value: "男"
            }, {
                sex: "2",
                value: "女"
            }],
            ageList: [{
                age: "1",
                value: "18-25"
            }, {
                age: "2",
                value: "26-35"
            }, {
                age: "3",
                value: "36-45"
            }, {
                age: "4",
                value: "46-55"
            }, {
                age: "5",
                value: "56-65"
            }],
            errText: "",
            //错误提示
            errToast: false,
        };
    }
    
    ageList =(age) => {
        this.setState({
            age: age
        }, function() {
            return this.begin();
        });
    }

    sexList = (sex) => {
        this.setState({
            sex: sex
        }, function() {
            return this.begin();
        });
    }

    begin = () => {
        var that = this;
        var sex = that.state.sex;
        var age = that.state.age;
        if (sex === "" || age === "") {
            return;
        }
        var params = {
            gender: sex,
            age: age
        };
        Taro.showLoading({
            title: "加载中"
        });
        api.ykt(params).then(function(res) {
            Taro.hideLoading();
            var jsondata = res.data;
            if (jsondata.code === 100) {
                var id = jsondata.data.id;
                // 这个需要再最后回答完成后，跳转到下一个页面传递用
                var fwcsl = jsondata.data.fwcsl || 0;
                var fsl = jsondata.data.fsl || 100;
                var datalist = jsondata.data.csmx;
                // 放待代替数据
                var alllist = datalist.slice(0);
                // 放所有数据
                var percent = fwcsl / fsl * 100;
                // 过滤数据，只展示未回答的数据列表
                var waitList = [];
                var finishedlist = {};
                if (fwcsl > 0 && datalist) {
                    datalist.map(function (element, index) {
                        element.bhid = index;
                        if (element.fda === 0) {
                            waitList.push(element);
                        } else {
                            finishedlist[element.id] = element.fda;
                            // 完成数据记录
                        }
                    });
                } else {
                    if (datalist) {
                        datalist.map(function (element, index) {
                            element.bhid = index;
                            if (element.fda === 0) {
                                waitList.push(element);
                            } else {
                                finishedlist[element.id] = element.fda;
                                // 完成数据记录
                            }
                        });
                    }
                }
                this.setState({
                    id: id,
                    questionList: alllist,
                    finishedlist: finishedlist,
                    waitList: waitList,
                    waitItem: waitList[0],
                    fsl: fsl,
                    fwcsl: waitList[0].bhid,
                    percent: percent
                });
            }
        }).catch(function(error) {
            Taro.hideLoading();
            that.setState({
                errText: "服务器异常，请稍后重试",
                errToast: true
            });
        });
    }

    select = () => {

    }

    jumpQuestion = (index) => {
        var questionList = this.state.questionList;
        this.setState({
            waitItem: questionList[index],
            show: false,
            fwcsl: index,
            fwczsl: index
        });
    }

    questionAllList = () => {

    }

    answerGuide = () => {
        this.setState({
            isOpened: true
        });
    }

    handleClose = () => {
        this.setState({
            isOpened: false
        });
    }

    onClose = () => {
        this.setState({
            show: false
        });
    }

    render() {
        var currentStyleY = {
            backgroundColor: "#6999E4",
            color: "#fff"
        };
        var currentStyleN = {
            backgroundColor: "#fff",
            color: "#6999E4"
        };
        const { sex } = this.state;
        const { age } = this.state;
        const { fwcsl } = this.state;
        const { fsl } = this.state;
        const { waitItem } = this.state;
        const { show } = this.state;
        const { isOpened } = this.state;
        return (
            <View className="index" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "100%" }}>
                <View className="proCon" show={sex!==''&&age!==''}>
                    <Text className="proNum">{fwcsl==0?1:fwcsl}</Text>
                    <at-progress __triggerObserer="{{_triggerObserer}}" className="progress" color="#00ff00" isHidePercent="{{true}}" percent="{{percent}}" sttus="progress"></at-progress>
                    <Text className="proNum">{fsl}</Text>
                </View>
                <View className="content">
                    <View className="contentText">本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过<Text style={{fontWeight: "bold"}}>30,000,000</Text>人，被医知TV的用户誉为<Text style={{fontWeight: "bold"}}>超准中医体质测。</Text>
                    </View>
                    <View className="contentTextFoot">为保证测试精准度，请耐心填写</View>
                </View>
                <View className="center">
                    <View show={sex===''||age===''}>
                        <View className="centerFirst">
                            <View className="centerTextTitle" style={{ backgroundImage: `url(${ansImg})`, backgroundSize: "100%" }}>
                                <Text className="biaoTitle">必答题</Text>
                            </View>
                            <View className="centerTextSex">
                                <Text className="firstQuestion">请问您的性别是？</Text>
                            </View>
                            <View className="centerTextAnswer">
                            {this.state.sexList.map((item, index) => {
                                return (<Text onClick={this.sexList.bind(this,item.value)} className="answer" data-e-tap-a-a="{{item[$original].sex}}" data-e-tap-so="this" style={sex === item.value ? currentStyleY : currentStyleN}>{item.value}</Text>)
                            })}
                            </View>
                            <View className="centerTextSex">
                                <Text className="firstQuestion">请问您的年龄是？</Text>
                            </View>
                            <View className="centerTextAnswer">
                            {this.state.ageList.map((item, index) => {
                                return (<Text onClick={this.ageList.bind(this,item.value)} className="answer" data-e-tap-a-a="{{item[$original].age}}" data-e-tap-so="this" style={age === item.value ? currentStyleY : currentStyleN}>{item.value}</Text>)
                            })}
                            </View>
                        </View>
                    </View>
                    <View className="centerFirsts" show={waitItem!=null}>
                        <View hidden={waitItem.kt!=''}>
                            {/* <View wx:for="{{loopArray2}}" wx:for-index="indexs" wx:for-item="items" wx:key="indexs">
                                <View className="centerTextTitle" style="{{items[$loopState__temp10]}}">
                                    <Text className="biaoTitle">第{fwcsl+1}题</Text>
                                </View>
                                <View className="centerTextQuestion">
                                    <Text className="firstQuestion">{{items[$original].ftitle}}</Text>
                                    <View className="centerTextAnswer">
                                        <block wx:if="{{items[$original].ktmx}}">
                                            <Text bindtap="select" className="answer" data-e-tap-a-a="{{waitItem}}" data-e-tap-a-b="{{itemss[$original].id}}" data-e-tap-a-c="{{itemss[$original].ffz}}" data-e-tap-so="this" style="{{itemss[$loopState__temp12]}}" wx:for="{{items[$anonymousCallee__0]}}" wx:for-index="indexss" wx:for-item="itemss" wx:key="indexss">{{itemss[$original].ftitle}}</Text>
                                        </block>
                                    </View>
                                </View>
                            </View> */}
                        </View>
                    </View>
                </View>

                <View onClick="questionAllList" className="questionAllList" show={sex!==''&&age!==''}>
                    <Text className="questionAllListText">查看题目</Text>
                </View>
                <AtFloatLayout __fn_onClose={true} __triggerObserer="{{_triggerObserer}}" onClose={this.onClose} data-e-onclose-so="this" isOpened={show} title="查看题目">
                    <View className="lookViewAnswer">
                    {this.state.questionList.map((item, index) => {
                            return (<Text onClick={this.jumpQuestion} className="lookAnswer" data-e-tap-a-a={index} data-e-tap-so="this" style={Object.keys(finishedlist).indexOf(item.id + "") >= 0 ? currentStyleY : currentStyleN}>{index+1}</Text>)
                    })}
                    </View>
                </AtFloatLayout>

                <View onTouchEnd={this.answerGuide} className="answerGuide">
                    <Text className="answerGuideText">答题指导</Text>
                </View>
                <AtFloatLayout __fn_onClose={true} __triggerObserer="{{_triggerObserer}}" onClose={this.handleClose} isOpened={isOpened} title="答题指导（根据最近三个月的情况选择）">
                    <View className="laycontainer">
                        <View className="layView">
                            <Text className="layAnswerTitle">没有：</Text>
                            <Text className="layAnswerCon">根本不，似乎没有发生过.</Text>
                        </View>
                        <View className="layView">
                            <Text className="layAnswerTitle">很少：</Text>
                            <Text className="layAnswerCon">好像有，很偶然，没必要放心上。</Text>
                        </View>
                        <View className="layView">
                            <Text className="layAnswerTitle">有时：</Text>
                            <Text className="layAnswerCon">偶尔有，没什么规律，有点担心。</Text>
                        </View>
                        <View className="layView">
                            <Text className="layAnswerTitle">经常：</Text>
                            <Text className="layAnswerCon">是，有这个现象，有点规律。</Text>
                        </View>
                        <View className="layView">
                            <Text className="layAnswerTitle">总是：</Text>
                            <Text className="layAnswerCon">是，一直困扰我。</Text>
                        </View>
                    </View>
                </AtFloatLayout>
                <AtToast __triggerObserer="{{_triggerObserer}}" duration={700} hasMask={false} isOpened={this.state.errToast} text={this.state.errText}></AtToast>
            </View>
        )
    }
}