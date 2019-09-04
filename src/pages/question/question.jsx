import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '../../api/index'

import './question.scss'

import bgImg from "../../assets/image/home-bg-fill.png";
import ansImg from "../../assets/image/ans-icon-sub.png";

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
            }]
        };
    }

    
    ageList(age, e){
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
        var that = this,sex = that.sex,age = that.age;
        console.log(age);
        console.log(sex);
        if (sex === "" || age === "") {
            return;
        }
        var params = {
            fgender: sex,
            age: age
        };
        Taro.showLoading({
            title: "加载中"
        });
        api.ykt(params).then(function(res) {
            Taro.hideLoading();
            var jsondata = res.data;
            if (jsondata.code === 100) {
                
            }
        }).catch(function(error) {
            Taro.hideLoading();
            this.setState({
                errText: "服务器异常，请稍后重试",
                errToast: true
            });
        });
    }

    select = () => {

    }

    jumpQuestion = (index) => {

    }

    answerGuide = () => {
        this.setState({
            isOpened: true
        });
    }

    handleClose = () => {

    }

    questionAllList = () => {

    }

    onClose = () => {

    }

    render() {
        const { sex } = this.state;
        const { age } = this.state;
        var saFlag = sex===''&&age==='';

        return (
            <View class="index" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "100%" }}>
                <View class="proCon" hidden={saFlag}>
                    <Text class="proNum">{fwcsl==0?1:fwcsl}</Text>
                    <at-progress __triggerObserer="{{_triggerObserer}}" className="progress" color="#00ff00" isHidePercent="{{true}}" percent="{{percent}}" sttus="progress"></at-progress>
                    <Text class="proNum">{fsl}</Text>
                </View>
                <View class="content">
                    <View class="contentText">本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过<Text style={{fontWeight: "bold"}}>30,000,000</Text>人，被医知TV的用户誉为<Text style={{fontWeight: "bold"}}>超准中医体质测。</Text>
                    </View>
                    <View class="contentTextFoot">为保证测试精准度，请耐心填写</View>
                </View>
                <View class="center">
                    <View hidden={!saFlag}>
                        <View class="centerFirst">
                            <View class="centerTextTitle" style={{ backgroundImage: `url(${ansImg})`, backgroundSize: "100%" }}>
                                <Text class="biaoTitle">必答题</Text>
                            </View>
                            <View class="centerTextSex">
                                <Text class="firstQuestion">请问您的性别是？</Text>
                            </View>
                            <View class="centerTextAnswer">
                            {this.state.sexList.map((item, index) => {
                                return (<Text onClick={this.sexList} class="answer" data-e-tap-a-a="{{item[$original].sex}}" data-e-tap-so="this" style="{{item[$loopState__temp6]}}">{item.value}</Text>)
                            })}
                            </View>
                            <View class="centerTextSex">
                                <Text class="firstQuestion">请问您的年龄是？</Text>
                            </View>
                            <View class="centerTextAnswer">
                            {this.state.ageList.map((item, index) => {
                                return (<Text onClick={this.ageList} class="answer" data-e-tap-a-a="{{item[$original].age}}" data-e-tap-so="this" style="{{item[$loopState__temp8]}}">{item.value}</Text>)
                            })}
                            </View>
                        </View>
                    </View>
                    <View class="centerFirsts" hidden={this.state.waitItem!=null}>
                        <View hidden={this.state.waitItem.kt!=''}>
                            {/* <View wx:for="{{loopArray2}}" wx:for-index="indexs" wx:for-item="items" wx:key="indexs">
                                <View class="centerTextTitle" style="{{items[$loopState__temp10]}}">
                                    <Text class="biaoTitle">第{fwcsl+1}题</Text>
                                </View>
                                <View class="centerTextQuestion">
                                    <Text class="firstQuestion">{{items[$original].ftitle}}</Text>
                                    <View class="centerTextAnswer">
                                        <block wx:if="{{items[$original].ktmx}}">
                                            <Text bindtap="select" class="answer" data-e-tap-a-a="{{waitItem}}" data-e-tap-a-b="{{itemss[$original].id}}" data-e-tap-a-c="{{itemss[$original].ffz}}" data-e-tap-so="this" style="{{itemss[$loopState__temp12]}}" wx:for="{{items[$anonymousCallee__0]}}" wx:for-index="indexss" wx:for-item="itemss" wx:key="indexss">{{itemss[$original].ftitle}}</Text>
                                        </block>
                                    </View>
                                </View>
                            </View> */}
                        </View>
                    </View>
                </View>
                <View bindtap="questionAllList" class="questionAllList" hidden={saFlag}>
                    <Text class="questionAllListText">查看题目</Text>
                </View>
                <at-float-layout __fn_onClose={true} __triggerObserer="{{_triggerObserer}}" bindonclose={this.onClose} data-e-onclose-so="this" isOpened={show} title="查看题目">
                    <View class="lookViewAnswer">
                    {this.state.questionList.map((item, index) => {
                            // <Text bindtap="jumpQuestion" class="lookAnswer" data-e-tap-a-a="{{index}}" data-e-tap-so="this" style="{{item[$loopState__temp14]}}">{{index+1}}</Text>
                    })}
                    </View>
                </at-float-layout>
                <View onTouchEnd={this.answerGuide} class="answerGuide">
                    <Text class="answerGuideText">答题指导</Text>
                </View>
                <at-float-layout __fn_onClose={true} __triggerObserer="{{_triggerObserer}}" bindonclose={this.handleClose} isOpened={this.isOpened} title="答题指导（根据最近三个月的情况选择）">
                    <View class="laycontainer">
                        <View class="layView">
                            <Text class="layAnswerTitle">没有：</Text>
                            <Text class="layAnswerCon">根本不，似乎没有发生过.</Text>
                        </View>
                        <View class="layView">
                            <Text class="layAnswerTitle">很少：</Text>
                            <Text class="layAnswerCon">好像有，很偶然，没必要放心上。</Text>
                        </View>
                        <View class="layView">
                            <Text class="layAnswerTitle">有时：</Text>
                            <Text class="layAnswerCon">偶尔有，没什么规律，有点担心。</Text>
                        </View>
                        <View class="layView">
                            <Text class="layAnswerTitle">经常：</Text>
                            <Text class="layAnswerCon">是，有这个现象，有点规律。</Text>
                        </View>
                        <View class="layView">
                            <Text class="layAnswerTitle">总是：</Text>
                            <Text class="layAnswerCon">是，一直困扰我。</Text>
                        </View>
                    </View>
                </at-float-layout>
                <at-toast __triggerObserer="{{_triggerObserer}}" duration={700} hasMask={false} isOpened={errToast} text={errText}></at-toast>
            </View>
        )
    }
}