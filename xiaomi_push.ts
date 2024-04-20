import Axios from 'axios';
import { MiPushMessage, MiPushMessageResponse, PushService } from './define_types';
import urlencode from 'urlencode';

export default class MiPush implements PushService {

    public server: string = 'https://api.xmpush.xiaomi.com';

    public path: string = '/v3/message/regid';

    public token: string = '';

    public tokenTime: number = 0;

    public tokenExpire: number = 0;


    //  配置
    public config: {
        app_id: string;//   应用id
        app_secret: string;//   应用密钥
        app_key: string;//   应用key
    };

    // 推送平台
    public constructor(params: {
        app_id: string;//   应用id
        app_secret: string;//   应用密钥
        app_key: string;//   应用key
    }) {
        const { app_id, app_secret, app_key } = params;

        this.config = {
            app_id,
            app_key,
            app_secret
        }
    }

    //  推送消息
    public async push(params: { content: string; }): Promise<boolean> {

        //  检查推送服务器鉴权状态
        await this.auth();

        const { content } = params;

        const payload = new MiPushMessage();

        payload.payload = urlencode.encode(content);
        payload.title = '测试标题'
        payload.description = '测试描述'
        payload.registration_id = 'DQzIuiFLAw6ki673Aqb7BA';

        const data = new URLSearchParams();

        for (const key in payload) {
            payload[key] && data.append(key, payload[key]);
        }

        const res = await Axios.post<MiPushMessageResponse>(`${this.server}${this.path}`, data, {
            headers: {
                'Authorization': `key=${this.token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { result, code, reason } = res.data;

        if (result !== 'ok') {
            console.error(`推送失败，错误码：${code}，错误原因：${reason}`);
            return false;
        }

        //  推送返回检查

        return true;
    }

    //  推送服务器鉴权
    public async auth(): Promise<void> {
        const { app_id, app_secret, app_key } = this.config;

        if (!this.token) {
            this.token = app_secret;

            this.tokenTime = Date.now();

        }


    }
}