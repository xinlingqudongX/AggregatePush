import { PushPlatform, PushService } from "./define_types";
import FlymePush from "./flyme_push";
import HuaWeiPush from "./huawei_push";
import OPPOPush from "./oppo_push";
import VIVOPush from "./vivo_push";
import MiPush from "./xiaomi_push";
import UniappPush from "./uniapp_push";

export default class AggregatePush {
    //  推送服务map
    private pushServiceMap: Map<PushPlatform, PushService> = new Map();

    public constructor(params: {
        flyme_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    魅族推送配置
        xiaomi_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    小米推送配置
        huawei_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    华为推送配置
        oppo_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    oppo推送配置
        vivo_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    vivo推送配置
        uniapp_config?: {
            app_id: string; //   推送app_id
            app_key: string; //   推送app_key
            app_secret: string; //   推送app_secret
        }; //    uniapp推送配置
    }) {
        const {
            flyme_config,
            xiaomi_config,
            huawei_config,
            oppo_config,
            vivo_config,
            uniapp_config,
        } = params;

        if (flyme_config) {
            this.pushServiceMap.set(
                PushPlatform.MEIZU,
                new FlymePush(flyme_config)
            );
        }

        if (xiaomi_config) {
            this.pushServiceMap.set(PushPlatform.MI, new MiPush(xiaomi_config));
        }

        if (huawei_config) {
            this.pushServiceMap.set(
                PushPlatform.HUAWEI,
                new HuaWeiPush(huawei_config)
            );
        }

        if (oppo_config) {
            this.pushServiceMap.set(
                PushPlatform.OPPO,
                new OPPOPush(oppo_config)
            );
        }

        if (vivo_config) {
            this.pushServiceMap.set(
                PushPlatform.VIVO,
                new VIVOPush(vivo_config)
            );
        }

        if (uniapp_config) {
            this.pushServiceMap.set(
                PushPlatform.UNIAPP,
                new UniappPush(uniapp_config)
            );
        }
    }

    //  推送平台服务
    public async push(params: {
        content: string; //    推送内容
        platform: PushPlatform; //    推送平台
        title?: string; //    推送标题
    }): Promise<boolean> {
        const { content, platform, title } = params;

        const pushService = this.getPushService(platform);

        if (!pushService) {
            return false;
        }

        return await pushService.push({ content, title });
    }

    //  获取推送服务
    private getPushService(platform: PushPlatform): PushService {
        const data = this.pushServiceMap.get(platform);
        if (!data) {
            throw new Error(`没有找到推送平台:${platform}`);
        }

        return data;
    }
}
