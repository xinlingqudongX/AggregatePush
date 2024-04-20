import { PushService } from "./define_types";
import Axios from 'axios';
import Crypto from 'crypto';
import { VIVOPushMessage } from "./vivo_type";

export default class VIVOPush implements PushService {

    public server: string = 'https://api-push.vivo.com.cn';

    public path: string = '/message/send';

    public token: string = '';

    public tokenExpire: number = 0;

    public tokenTime: number = 0;

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

    //  推送服务器推送
    public async push(params: { content: string; }): Promise<boolean> {
        const { content } = params;

        //  鉴权
        await this.auth();

        const payload = new VIVOPushMessage();
        payload.content = content;
        payload.regId = 'aaa';
        payload.title = 'aaaa';

        const res = await Axios.post<{
            result: number;
            desc: string;
            taskId: string;
            invalidUser?: {
                status: number;
                userid: string;
            }
        }>(`${this.server}${this.path}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                authToken: this.token,
            },

        });

        const { result, desc, taskId, invalidUser } = res.data;

        if (result !== 0) {
            console.error(`推送失败：${desc}`);
            return false;
        }

        return true;
    }

    //  推送服务器鉴权
    public async auth(): Promise<void> {
        const { app_id, app_secret, app_key } = this.config;

        if (this.token && this.tokenExpire > Date.now()) {
            return;
        }

        const timestamp = Date.now();
        const sign = this.sign({ app_id, app_secret, app_key, timestamp });
        const res = await Axios.post<{
            result: number;
            desc: string;
            authToken: string;
        }>(`${this.server}/message/auth`, {
            appId: app_id,
            appKey: app_key,
            timestamp,
            sign
        });

        const { result, desc, authToken } = res.data;

        if (result !== 0) {
            throw new Error(desc);
        }

        this.token = authToken;
        this.tokenTime = timestamp;
        this.tokenExpire = this.tokenTime + (60 * 60 * 1000 * 24);
    }

    //  签名 appId+appKey+timestamp+appSecret
    public sign(params: {
        app_id: string;
        app_secret: string;
        app_key: string;
        timestamp: number;
    }): string {
        const { app_id, app_secret, app_key, timestamp } = params;

        const sign = `${app_id}${app_key}${timestamp}${app_secret}`;
        const signStr = Crypto.createHash('md5').update(sign).digest('hex');
        return signStr;
    }
}