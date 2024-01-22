/***
 * 通知
 */
import { notification } from 'ant-design-vue';

type config = {
    placement?: 'top' | 'bottom'
}

export const notice = {
    success: (context: string, config?: config) => {
        notification.success({
            description: context,
            message: '',
            placement: config?.placement || 'bottom',
            bottom: '10vh',
            duration: 2
        })
    },
    warning: (context: string, config?: config) => {
        notification.warning({
            description: context,
            message: '',
            placement: config?.placement || 'bottom',
            bottom: '7vh',
            duration: 2
        })
    },
    error: (context: string, config?: config) => {
        notification.error({
            description: context,
            message: '',
            placement: config?.placement || 'bottom',
            bottom: '5vh',
            duration: 2
        })
    },
}