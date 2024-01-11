/***
 * 同源下的全局事件总线，支持跨标签页通信
 * 第一步：注册事件
 * 第二步：广播事件
 * 第三步：处理事件
 */

// source：消息发起源href，将在跨标签页通信时传入
type callback = (data: any, source: any) => void;
type eventName = string;

class EventBus{
    protected eventMap: any = new Map();
    protected channel: any = new BroadcastChannel('__event-bus');

    protected register(eventName: eventName, callback: callback) {
        if (!this.eventMap.has(eventName)) {
            this.eventMap.set(eventName, [])
        }
        this.eventMap.get(eventName).push(callback)
    }
    protected tryRunCallback(eventName: eventName, data: any, source?: string) {
        if (!this.eventMap.has(eventName)) return;
        this.eventMap.get(eventName).forEach((callback:callback) => {
            callback(data, source)
        });
    }

    // 广播事件
    emit(eventName: eventName, data?: any) {
        this.tryRunCallback(eventName, data);
        // 跨标签页 发送消息
        this.channel.postMessage({ eventName, data, source: location.href })
    }
    // 订阅事件
    on(eventName: eventName, callback: callback) {
        this.register(eventName, callback);
        // 跨标签页 接收订阅消息
        this.channel.onmessage = (event: {data: any}) => {
            const data = event.data;
            this.tryRunCallback(data.eventName, data.data, data.source)
        }
    }
    // 移除某个订阅事件
    off(eventName: eventName, callback: callback) {
        if (!this.eventMap.has(eventName)) return;
        const callbacks = this.eventMap.get(eventName)
        this.eventMap.set(eventName, callbacks.filter((cb: callback) => cb !== callback))
    }
    // 清除某个事件的所有订阅
    clear(eventName: eventName) {
        this.eventMap.delete(eventName)
    }
    // 清除所有订阅事件
    clearAll() {
        this.eventMap = new Map()
    }
}
const evbus = new EventBus()

export const $emit = evbus.emit.bind(evbus)
export const $on = evbus.on.bind(evbus)
export const $off = evbus.off.bind(evbus)
export const $clear = evbus.clear.bind(evbus)
export const $clearAll = evbus.clearAll.bind(evbus)