import Axios from 'axios';
import { HuaWeiPushMessage, PushService } from './define_types'
import { HuaweiBusinessCode } from './huawei_types';
export default class HuaWeiPush implements PushService {

    //  服务器地址
    public server: string = 'https://push-api.cloud.huawei.com';

    //  推送服务器鉴权时间
    public tokenTime: number = 0;

    //  推送服务器鉴权token
    public token: string = '';

    //  推送服务器鉴权过期时间
    public tokenExpire: number = 0;


    public get path(): string {
        const { app_id } = this.config;
        return `/v1/${app_id}/messages:send`;
    }

    public config: { app_id: string; app_secret: string; app_key: string; };

    public constructor(params: { app_id: string; app_secret: string; app_key: string; }) {
        const { app_id, app_secret, app_key } = params;
        this.config = {
            app_id,
            app_key,
            app_secret
        }

    }

    //  推送消息
    public async push(params: { content: string; }): Promise<boolean> {
        const { content } = params;
        const { app_id, app_key } = this.config;

        const payload = new HuaWeiPushMessage();
        payload.message = {
            data: content,
            // notification: {
            //     title: '',
            //     body: content,
            // }
        }

        const result = await Axios.post<{
            code: string;// 推送结果状态码
            msg: string;// 推送结果描述
            requestId: string;// 推送请求ID
        }>(`${this.server}${this.path}`, payload, {
            headers: {
                Authorization: this.token,
            },
        })

        if (result.status !== 200) {
            return false;
        }

        const { code, msg, requestId } = result.data;

        if (code !== HuaweiBusinessCode.成功) {
            return false;
        }

        return true;
    }

    //  推送服务器鉴权
    public async auth(): Promise<void> {
        const { app_id, app_secret, app_key } = this.config;
        const authUrl = 'https://oauth-login.cloud.huawei.com/oauth2/v3/token'

        if (this.token && this.tokenExpire > Date.now()) {
            return;
        }

        const result = await Axios.post<{
            access_token: string;// 授权token
            expires_in: number;// 授权过期秒数
            token_type: string;// 授权类型
        }>(authUrl, {
            grant_type: 'client_credentials',
            client_id: app_id,
            client_secret: app_secret,
        }, {
            headers: {
                'Content-Type': 'application/json;charest=UTF-8',
            }
        })

        if (result.status !== 200) {
            throw new Error('推送服务器鉴权失败');
        }

        const { access_token, expires_in, token_type } = result.data;

        //  设置推送服务器鉴权token
        this.token = `${token_type} ${access_token}`;
        //  设置推送服务器鉴权时间
        this.tokenTime = Date.now();

        //  设置推送服务器鉴权过期时间
        this.tokenExpire = this.tokenTime + expires_in * 1000;
    }
}