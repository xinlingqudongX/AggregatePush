
//  VIVO消息体类
export class VIVOPushMessage {
    public regId: string = '';//    推送设备唯一标识
    public notifyType: number = 1;//    推送类型，1：通知，2：透传消息
    public title: string = '';//    推送标题
    public content: string = '';//    推送内容
    public timeToLive: number = 86400;//    推送过期时间，单位秒，默认为24小时，最大支持10天
    public skipType: number = 1;//    推送跳转类型，1：打开应用，2：打开网页，3：打开应用内页面，4：打开应用外页面
    public skipContent: string = '';//    推送跳转内容
    public networkType: number = 1;//    推送网络类型，1：wifi，2：4G，3：3G，4：2G，5：全部，默认为5
    public clientCustomMap: any = {};//    推送自定义参数，key-value形式
    public extra: {
        callabck?: string;   //  回调数据
        "callback.param"?: string;   //  回调参数
    } = {}//    推送额外参数，key-value形式
    requestId: string = '';//    推送请求ID
}
