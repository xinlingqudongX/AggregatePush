import { PushService } from "./define_types";
import Axios from "axios";
import Crypto from 'crypto';
import urlencode from 'urlencode';

export default class FlymePush implements PushService {

    public server: string = 'http://server-apimzups.meizu.com';

    // public path: string = '/ups/api/server/push/unvarnished/pushByPushId';
    public path: string = '/ups/api/server/push/pushTask/pushToApp';

    public token: string = '';

    public tokenTime: number = 0;

    public tokenExpire: number = 0;

    public config: {
        app_id: string;
        app_secret: string;
        app_key: string;
    };

    public constructor(params: {
        app_id: string;
        app_secret: string;
        app_key: string;
    }) {
        const { app_id, app_secret, app_key } = params;

        this.config = {
            app_id,
            app_key,
            app_secret
        }
    }

    public async auth(): Promise<void> {
        const { app_id, app_secret, app_key } = this.config;

        const result = await Axios.post<any>(`${this.server}${this.path}`, {
            app_id,
            app_secret,
            app_key,
        });

        if (result.status === 200) {
            const { data } = result;

            if (data.code === 0) {
                const { token, expire } = data.data;

                this.token = token;
                this.tokenTime = Date.now();
                this.tokenExpire = expire;
            }
        }
    }

    //  推送消息
    public async push(params: {
        content: string; pushIds: string; title: string;
    }): Promise<boolean> {
        const { content, pushIds, title } = params;
        const { app_id, app_key, app_secret } = this.config;

        const payload: {
            appId: string;
            pushType: number;
            noticeBarInfo: {
                title: string;
                content: string;
            };
            sign?: string;
        } = {
            appId: app_id,
            pushType: 0,
            noticeBarInfo: {
                title,
                content,
            }
        };

        const sign = this.sign(payload);
        payload.sign = sign;

        const result = await Axios.post<any>(`${this.server}${this.path}`, payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });

        const { code, message } = result.data;

        if (code !== 200) {
            throw new Error(message);
        }

        return true;
    }

    //  签名
    public sign(params: {
        [key: string]: any
    }) {
        const { app_secret } = this.config;

        const keys = Object.keys(params).sort();

        const sign = keys.map(key => {
            return `${key}=${JSON.stringify(params[key])}`;
        }).join('') + app_secret;
        const singStr = Crypto.createHash('md5').update(sign).digest('hex');

        return singStr
    }
}