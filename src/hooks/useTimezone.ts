import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { computed, ref } from "vue";
dayjs.extend(utc);

// 时区
export const timezone = ref<number>(0)
// 时区下拉选项
export const timezoneOptions = computed(() => {
    const opt = []
    for (let i = -12; i < 13; i++) {
        opt.push({ label: `${i < 0 ? '' : '+'}${i}:00`, value: i })
    }
    return opt
})

/**
 * 日期时间转换（根据时区转换为指定格式）
 * @param value 日期时间值
 * @param format 时间转换格式, 默认YYYY-MM-DD
 * @param zone 时区数值， 默认0标准时区
 * @returns string
 */
export const Format = function (value: string | number, format: string = 'YYYY-MM-DD', zone: number = 0) {
    if (!value) return undefined;
    const offset = Number(zone) + new Date().getTimezoneOffset() / -60; // 本地时区偏移
    let date: string | number = value
    // 带Z的时区转换问题修复
    if (typeof date === 'string' && /Z/.test(date)) {
        date = String(value).replace(/\..*[Z]?/, "")
    }
    return dayjs(date).utcOffset(offset * 60).format(format)
}

/**
 * 计算属性 日期时间转换（根据时区转换为指定格式）
 * @param value 日期时间值
 * @param format 时间转换格式, 默认YYYY-MM-DD
 * @param _timezone 可选参数 指定时区
 * @returns string
 */
export const DateTimeZone = computed(() => (value: string, format: string = 'YYYY-MM-DD', _timezone?: number) => {
    if (typeof _timezone === 'number') {
        return Format(value, format, _timezone)
    } else {
        return Format(value, format, timezone.value)
    }
})