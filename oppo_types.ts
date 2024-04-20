
//  OPPO推送消息体
export class OPPOPushMessage {
    target_type: string = '';//  目标类型
    target_value: string = '';//  目标值
    notification: {
        app_message_id?: string;//   消息id
        style?: number;//  消息样式
        big_picture_id?: string;//  大图id
        small_picture_id?: string;//  小图id
        title: string;//  消息标题
        sub_title?: string;//  消息副标题
        content: string;//  消息内容
        click_action_type?: number;//  点击行为类型
        click_action_activity?: string;//  点击行为activity
        click_action_url?: string;//  点击行为url
        action_parameters?: string;//  点击行为参数
        show_time_type?: number;//  显示时间类型
        show_start_time?: number;//  显示开始时间
        show_end_time?: number;//  显示结束时间
        off_line?: boolean;//  是否离线
        off_line_ttl?: number;//  离线缓存时间
        push_time_type?: number;//  推送时间类型
        push_start_time?: number;//  推送开始时间
        time_zone?: string;//  时区
        fix_speed?: boolean;//  是否定时推送
        fix_speed_rate?: number;//  定时推送频率
        newwork_type?: number;// 网络类型
        call_back_url?: string;//  回调url
        call_back_parameter?: string;//  回调参数
        channel_id?: string;//  渠道id
        show_ttl?: number;//  显示时间
        notify_id?: number;//    通知id
    } = {
            title: '',
            content: '',
        };//  推送消息体
    verify_registration_id: boolean = true;//  是否验证registration_id
}