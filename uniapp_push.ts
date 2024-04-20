import Axios from 'axios';
import { PushService } from "./define_types";
import Crypto from 'crypto';

export default class UniappPush implements PushService {

    public get server() {
        const { app_id } = this.config;
        return `https://restapi.getui.com/v2/${app_id}`
    }

    public path: string = '';

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

    //  推送服务器推送
    public async push(params: { content: string; }): Promise<boolean> {
        const { content } = params;

        await this.auth();

        const result = await Axios.post<{
            code: number;
            msg: string;
            data: {
                taskid: {
                    cid: string;
                }
            }
        }>(`${this.server}/push/single/cid`, {
            request_id: Math.random().toString().slice(2, 6) + Date.now().toString().slice(2),
            group_name: '',
            audience: {
                cid: ['bc562296eb70d8350b7c77a56056c2e3']
            },
            settings: {
                ttl: -1,//   消息离线时间
                strategy: {}
            },
            push_message: {
                notification: {
                    title: '推送标题',
                    body: content,
                    click_type: 'none',

                }
            },
            push_channel: {},
        }, {
            headers: {
                token: this.token,
            },
        })

        const { code, msg } = result.data;

        if (code !== 0) {
            console.log(msg);
            return false;
        }

        return true;
    };

    //  推送服务器鉴权
    public async auth(): Promise<void> {
        const { app_id, app_secret, app_key } = this.config;

        if (this.token && this.tokenTime + this.tokenExpire > Date.now()) {
            return;
        }

        const now = Date.now();
        const sign = this.sign({
            timestamp: now,
            app_key,
            app_secret,
        })
        const result = await Axios.post<{
            code: number;
            msg: string;
            data: {
                expire_time: string;
                token: string;
            }
        }>(`${this.server}/auth`, {
            sign,
            timestamp: `${now}`,
            appkey: app_key,
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        })

        if (result.data.code !== 0) {
            throw Error(result.data.msg);
        }

        const { token, expire_time } = result.data.data;

        this.token = token;

        this.tokenExpire = parseInt(expire_time);

        this.tokenTime = now;
    }

    //  签名
    public sign(params: {
        app_key: string;
        app_secret: string;
        timestamp: number;
    }): string {
        const { app_key, app_secret, timestamp } = params;

        const sign = `${app_key}${timestamp}${app_secret}`;
        const signStr = Crypto.createHash('sha256').update(sign).digest('hex');
        return signStr;
    }
}