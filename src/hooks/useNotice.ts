/***
 * 通知
 */
import { notification } from 'ant-design-vue';
import i18n from "@/i18n"
const { t } = i18n.global;

type config = {
    placement?: 'top' | 'bottom'
}

export const notice = {
    success: (context: string, config?: config) => {
        notification.success({
            description: context,
            message: '',
            placement: config?.placement || 'top',
            bottom: '10vh',
            duration: 2
        })
    },
    warning: (context: string, config?: config) => {
        notification.warning({
            description: context,
            message: '',
            placement: config?.placement || 'top',
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

// 提交成功
export const notice_submit_success = () => notice.success(t('toast.submit_success'))