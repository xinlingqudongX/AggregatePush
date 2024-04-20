
### 小米推送开发文档
-   小米推送有测试环境和正式环境，但是测试环境只针对iOS，不支持Android，所以没什么用
-   小米推送有V2、V3、V4版本推送接口
-   请求方式：POST
-   请求头添加Authorization字段，值为：key=YOUR_APP_SECRET
-   提交的数据格式为JSON，如下：
| 字段 | 类型 | 描述 |
| --- | --- | --- |
|payload|string|推送消息内容，必填，需要urlencode|
|pass_through|number|0 通知栏消息 1 透传消息|
|title|string|通知栏消息标题|
|description|string|通知栏消息内容|
|notify_type|number|通知栏消息类型|
|time_to_live|number|消息过期时间，单位毫秒，默认最长两周|
|time_to_send|number|定时发送时间，单位毫秒|
|notify_id|number|可选，不同的消息要不同的id|
|extra.soumnd_uri|string|可选，自定义铃声URI|
|extra.tricker|string|可选，开启通知在状态栏滚动显示|
|

### 小米推送API
-   向某个regid或一组regid列表推送某条消息
    -   https://api.xmpush.xiaomi.com/v2/message/regid

-   向某个alias或一组alias列表推送某条消息
    -   https://api.xmpush.xiaomi.com/v2/message/alias

-   向某个account或一组account列表推送某条消息
    -   https://api.xmpush.xiaomi.com/v2/message/user_account

-   向某个topic推送某条消息
    -   https://api.xmpush.xiaomi.com/v2/message/topic

-   向多个topic推送单条消息
    -   https://api.xmpush.xiaomi.com/v2/message/multi_topic

-   向所有设备推送某条消息
    -   https://api.xmpush.xiaomi.com/v2/message/all

### 华为推送开发文档
-   首先获取鉴权凭证
-   开发者服务器调用华为帐号服务器的接口（https://oauth-login.cloud.huawei.com/oauth2/v3/token）请求凭证Token。
-   提交参数获取鉴权的token
-   发送通知请求
-   https://push-api.cloud.huawei.com/v1/[appId]/messages:send
-   

### VIVO推送开发文档
-   服务器地址
    -   https://api-push.vivo.com.cn

-   请求方式
    -   POST
-   请求头，鉴权的token，有效期一天
    -   authToken: vivo_token
-   鉴权服务器请求地址
    -   https://api-push.vivo.com.cn/message/auth
-   鉴权请求参数
    -   {

        "appId":10004,

          "appKey":"25509283-3767-4b9e-83fe-b6e55ac6243e",

        "timestamp":1501484120000,

          "sign":"8424f52fd5eaedc16474e4f702d230d2"

}
-   签名计算方式：字符串trim后拼接（appId+appKey+timestamp+appSecret）
-   推送请求，POST    
    -   /message/send


### OPPO推送开发文档
-   国内服务器地址
    -   https://api.push.oppomobile.com/
-  国外服务器地址
    -   https://api-intl.push.oppomobile.com/
-   请求方式
    -   POST
-   需要发送鉴权请求，POST请求
    -  /server/v1/auth
-   请求参数
    -   app_key
    -   sign，签名：sha256(appkey+timestamp+mastersecret)
mastersecret为注册应用时生成
    -   timestamp，时间戳，单位毫秒
-   推送接口
    -   /server/v1/message/notification/unicast


### 魅族推送开发文档
-   服务器地址
    -   https://api.flyme.cn/push/v1/
-   签名计算方式
    1. 将参数以其参数名的字典序升序进行排序,如 对 k1 k2 k3 排序
    2. 遍历排序后的字典，将所有参数按"key=value"格式拼接在一起，如“k1=v1k2=v2k3=v3”
    3. 在拼接好的字符串末尾追加上应用的Secret Key
上述字符串的MD5值即为签名的值。（32位小写）


-   /garcia/api/server/push/task/varnished/pushByPushId