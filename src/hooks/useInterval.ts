import type { number } from "echarts"

/***
 * callback 定时任务回调函数，
 * time 任务执行的间隔时间，
 * config.accurate 是否是精准的定时任务，如果是，会自动修正定时器偏差。
 */
const INTERVAL = function (callback: () => void, time: number, config?: {
    accurate: boolean // 是否是精准的定时任务，如果是，会自动修正定时器偏差。
}) {
    let task: any = null

    const record = {
        startTime: 0,
        runTime: 0,
        offsetTime: 0
    }

    const run = () => {
        if (config?.accurate) {
            record.startTime = new Date().getTime()
        }
        task = setTimeout(() => {
            if (config?.accurate) {
                record.runTime = new Date().getTime()
                record.offsetTime = time - (record.runTime - record.startTime)
            } else {
                record.offsetTime = 0
            }
            // 必须先run，再执行callback，防止在callback中调用clearTask方法无效
            run()
            callback()
        }, time + record.offsetTime)
    }

    const clearTask = () => {
        clearTimeout(task)
        task = null
    }

    /**
     * 启动定时任务
     * @param immediate 是否立即运行
     */
    const startTask = (immediate?: boolean) => {
        if (immediate) {
            callback()
        }
        clearTask()
        run();
    }

    return {
        clearTask,
        startTask
    }
}

/**
 * 尝试间隔执行回调任务，直至返回值未true 或者 超过最大次数为止
 * @param callback 回调函数
 * @param time 回调间隔时间
 * @param maxLength 最多回调次数
 */
export const tryAegin = (callback: () => Boolean, time: number, maxLength: number = 10) => {
    let _number = 0;
    const { clearTask, startTask } = INTERVAL(() => {
        const result = callback()
        _number++;
        if (result === true || _number >= maxLength) {
            clearTask()
        }

    }, time)
    startTask()
}

export default INTERVAL