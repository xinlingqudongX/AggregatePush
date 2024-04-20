
//  uniapp推送消息内容接口
export interface UniappPushMessage {
    duration: string;// 手机端通知展示时间段
    notification?: {};// 通知内容
    transmission?: string;// 消息透传内容
    revoke?: {};
}