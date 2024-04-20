

//  推送服务接口
export interface PushService {
    // // 环境，测试环境或者正式环境
    // env: string;
    // 推送服务器地址
    server: string;
    // // 推送服务器端口
    // port: number;
    // 推送服务器路径
    path: string;
    // 推送服务器鉴权token
    token: string;
    // 推送服务器鉴权时间
    tokenTime: number;
    // 推送服务器鉴权过期时间
    tokenExpire: number;
    // 推送服务器鉴权有效时长,单位秒
    // tokenValid: number;

    // 推送服务器鉴权状态
    // tokenStatus: boolean;

    config: {
        app_id: string;
        app_secret: string;
        app_key: string;
    }

    // 推送服务器鉴权
    auth(): Promise<void>;

    //  推送服务器推送
    push(params: {
        // 消息内容
        content: string;
        // 消息标题
        title?: string;
    }): Promise<boolean>;
}

//  推送平台枚举
export enum PushPlatform {
    //  小米
    MI = 'mi',
    //  华为
    HUAWEI = 'huawei',
    //  vivo
    VIVO = 'vivo',
    //  oppo
    OPPO = 'oppo',
    //  魅族
    MEIZU = 'meizu',
    //  Uniapp
    UNIAPP = 'uniapp',
}

//  小米推送提示类型
export enum MiPushType {
    // 默认
    DEFAULT_ALL = -1,
    // 默认提示音
    DEFAULT_SOUND = 1,
    // 默认提示震动
    DEFAULT_VIBRATE = 2,
    // 默认leg灯光
    DEFAULT_LIGHT = 4,
}

//  小米标签操作类型
export enum MiTagOp {
    并集 = 'UNION',
    交集 = 'INTERSECTION',
    差集 = 'EXCEPT',
}

//  小米推送消息公共对象
export class MiPushMessageCommon {
    // 注册id
    public registration_id?: string;
    //  别名
    public alias?: string = '';
    // //  账户名称
    // public account: string = '';
    //  标签
    public topic?: string;
    // 标签列表，逗号分隔
    public topics?: string;
    //  标签之前的操作关系
    public topic_op?: string;

}

//  小米推送消息对象
export class MiPushMessage extends MiPushMessageCommon {
    // 消息的内容
    public payload: string = '';
    // 消息的包名,多个包名用逗号分隔
    public restricted_package_name: string = '';
    // 消息是否透传 1 透传 0 通知栏
    public pass_through: number = 0;
    // 消息的标题
    public title: string = '';
    // 消息的简介
    public description: string = '';
    // 消息的类型
    public notify_type: MiPushType = MiPushType.DEFAULT_ALL;
    // 消息的离线保存时间，默认两周，毫秒
    public time_to_live?: number;
    // 消息的定时时间，只支持七天，毫秒
    public time_to_send?: number;
    //  通知id，相同的覆盖
    public notify_id?: number;
    // 消息的自定义铃声uri
    public extra$sound_uri?: string;
    // 消息的显示状态，是否滚动显示
    public extra$tricker?: string;
    // 消息的通知弹出，默认弹出 1 弹出 0 不弹出
    public extra$notify_foreground: '1' | '0' = '1';
    // 消息的通知栏点击行为，1 打开app 2 打开activity 3 打开url
    public extra$notify_effect?: '1' | '2' | '3';
    // 消息的通知栏点击行为的uri
    public extra$intent_uri?: string;
    // 消息的通知栏点击行为的网页url
    public extra$web_uri?: string;
    //  消息是否平缓发送
    public extra$flow_control?: number;
    //  消息的批次
    public extra$jobkey?: string;
    //  消息的回执，配置http接口地址
    public extra$callback?: string;
    //  消息的回执参数
    public extra$callback$param?: string;
    //  消息的回执类型
    public extra$callback$type?: number;
    //  接收消息的设备语言范围
    public extra$locale?: string;
    //  无法接收消息的设备语言范围,多个设备语言用逗号分隔
    public extra$locale_not_in?: string;
    //  可以收到消息的机型范围
    public extra$model?: string;
    //  不可以收到消息的机型范围,多个机型用逗号分隔
    public extra$model_not_in?: string;
    //  可以收到消息的版本范围
    public extra$app_version?: string;
    //  不可以收到消息的版本范围,多个版本用逗号分隔
    public extra$app_version_not_in?: string;
    //  收到消息的网络环境
    public extra$connpt?: string;
    //  不缓存消息，在线发送
    public extra$only_send_once?: '1';

}

//  消息推送返回接口
export interface MiPushMessageResponse {
    //  消息状态
    result: 'ok' | 'error';
    //  错误原因
    reason?: string;
    trace_id?: string;
    //  数据
    data: string;
    //  返回码
    code: number;
    //  详细信息
    info: string;
    //  说明
    description: string;
}


//  华为消息类型枚举
export enum HwPushType {
    即时聊天 = 'IM',
    音视频通话 = 'VOIP',
    订阅 = 'SUBSCRIPTION',
    出行 = 'TRAVEL',
    健康 = 'HEALTH',
    工作事项提醒 = 'WORK',
    账号动态 = 'ACCOUNT',
    订单$物流 = 'EXPRESS',
    财务 = 'FINANCE',
    设备提醒 = 'DEVICE_REMINDER',
    系统提示 = 'SYSTEM_REMINDER',
    邮件 = 'MAIL',
    语音播报 = 'PLAY_VOICE',
    内容推荐 = 'MARKETING',
}

//  华为推送消息对象
export class HuaWeiPushMessage {
    //  是否为测试消息
    public validate_only?: boolean = false;
    //  消息体
    public message?: {
        //  消息数据
        data: string;
        notification?: {
            //  消息标题
            title: string;
            //  消息内容
            body: string;
            //  消息自定义图片
            image?: string;
        };
        //  Android消息控制参数
        android?: {
            //  用户设备离线时是否保存消息
            collapse_key?: number;
            //  透传消息投递优先级
            urgency?: 'HIGH' | 'NORMAL';
            //  消息类型
            category?: HwPushType;
            //  消息缓存时间 单位秒
            ttl?: string;
            //  批量任务消息标识
            bi_tag?: string;
            //  回执id
            receipt_id?: string;
            //  快应用透传的小程序模式类型
            fast_app_target?: number;
            //  消息数据 可覆盖通知栏消息
            data?: string;
            //  消息结构体
            notification: {
                //  消息标题
                title: string;
                //  消息内容
                body: string;
                //  消息自定义图标
                icon?: string;
                //  消息自定义颜色
                color?: string;
                //  消息自定义声音
                sound?: string;
                //  消息默认铃声
                default_sound?: boolean;
                //  消息标签
                tag?: string;
            }
        };
        apns?: {};
        webpush?: {};
        tokem?: Array<string>;
        topic?: string;
        condition?: string;

    };
    //  第三方审核结果
    public review?: {
        //  第三方审核机构名称
        reviewer: string;
        //  第三方审核类型
        type: number;
        //  第三方审核结果
        result: {

        }
    }
}

//  VIVO错误码枚举
export enum VivoPushErrorCode {
    appid不能为空 = '10200',
    appkey不能为空 = '10201',
    appkey不合法 = '10202',
    timestamp不能为空 = '10203',
    sign不能为空 = '10204',
    appid不存在 = '10205',
    sign不存在 = '10206',
    timestamp不合法 = '10207',
    认证接口超过调用次数限制 = '10250',
    单推超量限制 = '10070',
    批量推超量限制 = '10252',
    总量限制 = '10254',
}

