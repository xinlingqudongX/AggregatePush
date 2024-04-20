
import Axios from "axios";
import { PushService } from "./define_types";
import { OPPOPushMessage } from "./oppo_types";
import Crypto from 'crypto';
import Qs from 'querystring';

export default class OPPOPush implements PushService {

    //  国内请求地址
    public server: string = 'https://api.push.oppomobile.com';
    //  国外请求地址
    // public server: string = 'https://api-intl.push.oppomobile.com';

    public token: string = 'db92bf1d-c0ed-4714-abbd-6da4fc626225';

    public tokenTime: number = 0

    public tokenExpire: number = 0;

    public path: string = '/server/v1/message/notification/unicast';

    public config: {
        app_id: string;
        app_secret: string;
        app_key: string;
    };

    public constructor(params: {
        app_id: string;
        app_key: string;
        app_secret: string;
    }) {
        const { app_id, app_key, app_secret } = params;

        this.config = {
            app_id,
            app_key,
            app_secret
        }
    }

    //  推送消息
    public async push(params: { content: string; }): Promise<boolean> {
        const { content } = params;
        const { app_id, app_key, app_secret } = this.config;

        // await this.auth();

        const payload = new OPPOPushMessage();
        payload.target_type = 'registration_id';
        payload.target_value = 'aaa';
        payload.verify_registration_id = true;
        payload.notification.title = 'title';
        payload.notification.content = content;

        const data = new URLSearchParams();
        data.append('message', JSON.stringify(payload));

        const result = await Axios.post(`${this.server}${this.path}`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                auth_token: this.token,
            }
        })

        const { code, message } = result.data;

        if (code !== 0) {
            throw new Error(message);
        }


        return true;
    }

    //  推送服务器鉴权
    public async auth(): Promise<void> {
        const authUrl = `${this.server}/server/v1/auth`;

        const { app_id, app_key, app_secret } = this.config;

        if (this.token && this.tokenTime + this.tokenExpire > Date.now()) {
            return;
        }

        const timestamp = Date.now();
        const sign = this.sign({ app_key, app_secret, timestamp });
        const dt = new URLSearchParams();
        dt.append('app_key', app_key);
        dt.append('timestamp', timestamp.toString());
        dt.append('sign', sign);

        const result = await Axios.post<{
            code: number;// 状态码
            message: string;// 信息
            data: {
                auth_token: string;
                create_time: number;//  创建时间
            }
        }>(authUrl, dt, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });

        const { code, message, data } = result.data;

        if (code !== 0) {
            throw new Error(message);
        }

        this.token = data.auth_token;

        this.tokenTime = data.create_time || Date.now();

        this.tokenExpire = this.tokenTime + (1000 * 60 * 60 * 24);
    }

    //  签名
    public sign(params: {
        app_key: string;
        app_secret: string;
        timestamp: number;
    }): string {
        const { app_key, app_secret, timestamp } = params;

        const str = `${app_key}${timestamp}${app_secret}`;
        const signStr = Crypto.createHash('sha256').update(str).digest('hex');

        return signStr
    }
}