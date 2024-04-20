
//  华为HTTP错误码枚举
export enum HuaweiHttpErrorCode {
    成功 = 200,
    参数错误 = 400,
    鉴权失败 = 401,
    找不到服务 = 404,
    服务器内部错误 = 500,
    连接异常 = 502,
    流量控制 = 503,
}

//  华为业务码枚举
export enum HuaweiBusinessCode { 
    成功 = '80000000',
    部分成功 = 80100000,
    参数错误 = 80100001,
    token数量必须为1 = 80100002,
    消息结构体错误 = 80100003,
    消息过期时间错误 = 80100004,
    消息字段不合法 = 80100013,
    消息字段有敏感信息 = 80100016,
    同时发送的任务超过100个 = 80100017,
}