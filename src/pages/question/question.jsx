import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '../../api/index'

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
            sex: "",
            // 性别
            age: "",
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


    render() {
        // if(sex!== '' && age !== '') {

        // }
        return (<View></View>
            // <view class="index" style="{{anonymousState__temp}}">
            //     <view class="proCon" wx:if="{{ sex!== '' && age !== ''}}">
            //         <text class="proNum">{{ fwcsl== 0 ? 1 : fwcsl}}</text>
            //         <at-progress __triggerObserer="{{_triggerObserer}}" className="progress" color="#00ff00"
            //                     isHidePercent="{{true}}" percent="{{percent}}" sttus="progress"></at-progress>
            //         <text class="proNum">{{ fsl }}</text>
            //     </view>
            //     <view class="content">
            //         <view class="contentText">本测试来自《中医体质分类与判定》国家标准。自2010年上线以来已经服务超过<text style="{{anonymousState__temp2}}">
            //             30,000,000</text>人，被医知TV的用户誉为
            //             <text style="{{anonymousState__temp3}}">超准中医体质测。</text>
            //         </view>
            //         <view class="contentTextFoot">为保证测试精准度，请耐心填写</view>
            //     </view>

            //     <view class="center">
            //         <view wx:if="{{ sex=== '' || age === ''}}">
            //             <view class="centerFirst">
            //                 <view class="centerTextTitle" style="{{anonymousState__temp4}}">
            //                     <text class="biaoTitle">必答题</text>
            //                 </view>
            //                 <view class="centerTextSex">
            //                     <text class="firstQuestion">请问您的性别是？</text>
            //                 </view>
            //                 <view class="centerTextAnswer">
            //                     <block wx:if="{{ sexList }}">
            //                         <text bindtap="sexList" class="answer" data-e-tap-a-a="{{item[$original].sex}}"
            //                             data-e-tap-so="this" style="{{item[$loopState__temp6]}}" wx:for="{{ loopArray0 }}"
            //                             wx:key="index">{{ item[$original].value }}
            //                         </text>
            //                     </block>
            //                 </view>
            //                 <view class="centerTextSex">
            //                     <text class="firstQuestion">请问您的年龄是？</text>
            //                 </view>
            //                 <view class="centerTextAnswer">
            //                     <block wx:if="{{ ageList }}">
            //                         <text bindtap="ageList" class="answer" data-e-tap-a-a="{{item[$original].age}}"
            //                             data-e-tap-so="this" style="{{item[$loopState__temp8]}}" wx: for="{{ loopArray1 }}"
            //                             wx:key="index">{{ item[$original].value }}
            //                         </text>
            //                     </block>
            //                 </view>
            //             </view>
            //         </view>
            //         <view class="centerFirsts" wx:if="{{waitItem}}">
            //             <block wx:if="{{ waitItem.kt }}">
            //                 <view wx:for="{{ loopArray2 }}" wx:for-index="indexs" wx:for-item="items" wx:key="indexs">
            //                     <view class="centerTextTitle" style="{{items[$loopState__temp10]}}">
            //                         <text class="biaoTitle">第{{ fwcsl+ 1}}题</text>
            //                     </view>
            //                     <view class="centerTextQuestion">
            //                         <text class="firstQuestion">{{ items[$original].ftitle }}</text>
            //                         <view class="centerTextAnswer">
            //                             <block wx:if="{{ items[$original].ktmx }}">
            //                                 <text bindtap="select" class="answer" data-e-tap-a-a="{{waitItem}}"
            //                                     data-e-tap-a-b="{{itemss[$original].id}}"
            //                                     data-e-tap-a-c="{{itemss[$original].ffz}}" data-e-tap-so="this"
            //                                     style="{{itemss[$loopState__temp12]}}" wx:for="{{ items[$anonymousCallee__0]}}"
            //                                     wx:for-index="indexss" wx:for-item="itemss" wx:key="indexss">{{
            //                                     itemss[$original].ftitle }}
            //                                 </text>
            //                             </block>
            //                         </view>
            //                     </view>
            //                 </view>
            //             </block>
            //         </view>
            //     </view>
            //     <view bindtap="questionAllList" class="questionAllList" wx:if="{{sex!==''&&age!==''}}">
            //         <text class="questionAllListText">查看题目</text>
            //     </view>
            //     <at-float-layout __fn_onClose="{{true}}" __triggerObserer="{{_triggerObserer}}" bindonclose="onClose"
            //                     data-e-onclose-so="this" isOpened="{{show}}" title="查看题目">
            //         <view class="lookViewAnswer">
            //             <block wx:if="{{ questionList }}">
            //                 <view wx:for="{{ loopArray3 }}" wx:key="index">
            //                     <text bindtap="jumpQuestion" class="lookAnswer" data-e-tap-a-a="{{index}}" data-e-tap-so="this"
            //                         style="{{item[$loopState__temp14]}}">{{ index+ 1}}
            //                     </text>
            //                 </view>
            //             </block>
            //         </view>
            //     </at-float-layout>
            //     <view bindtap="answerGuide" class="answerGuide">
            //         <text class="answerGuideText">答题指导</text>
            //     </view>
            //     <at-float-layout __fn_onClose="{{true}}" __triggerObserer="{{_triggerObserer}}" bindonclose="handleClose"
            //                     isOpened="{{isOpened}}" title="答题指导（根据最近三个月的情况选择）">
            //         <view class="laycontainer">
            //             <view class="layView">
            //                 <text class="layAnswerTitle">没有：</text>
            //                 <text class="layAnswerCon">根本不，似乎没有发生过.</text>
            //             </view>
            //             <view class="layView">
            //                 <text class="layAnswerTitle">很少：</text>
            //                 <text class="layAnswerCon">好像有，很偶然，没必要放心上。</text>
            //             </view>
            //             <view class="layView">
            //                 <text class="layAnswerTitle">有时：</text>
            //                 <text class="layAnswerCon">偶尔有，没什么规律，有点担心。</text>
            //             </view>
            //             <view class="layView">
            //                 <text class="layAnswerTitle">经常：</text>
            //                 <text class="layAnswerCon">是，有这个现象，有点规律。</text>
            //             </view>
            //             <view class="layView">
            //                 <text class="layAnswerTitle">总是：</text>
            //                 <text class="layAnswerCon">是，一直困扰我。</text>
            //             </view>
            //         </view>
            //     </at-float-layout>
            //     <at-toast __triggerObserer="{{_triggerObserer}}" duration="{{700}}" hasMask="{{false}}" isOpened="{{errToast}}"
            //             text="{{errText}}"></at-toast>
            // </view>
        )
    }
}

exports.default = Question;