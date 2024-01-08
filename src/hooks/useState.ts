import { awaitTime } from "@/utils";
import { ref, type Ref } from "vue";

/**
 * 定义响应api
 * @param defaultValue 默认值
 * @returns [Ref<type>, (value: type, delay?: number) => void]
 */
export default function <type>(defaultValue: type): [Ref<type>, (value: type, delay?: number) => void] {

    const [target] = [ref<any>(defaultValue)];

    /**
     * 值设置
     * @param value 将要设置的新值
     * @param delay 设置新值的延迟时间，默认同步设置
     */
    const setValue = async (value: type, delay?: number) => {
        if (delay !== undefined && delay !== null) {
            await awaitTime(delay || 0)
        }
        target.value = value;
    }

    return [target, setValue]
}