import fileDownload from "js-file-download";
import useRequest from "./useRequest"
import i18n from "@/i18n"
import { notice } from "./useNotice";
import type { Record, RequestResult } from "@/types";
const { t } = i18n.global;

/**
 * 下载文件
 * @param query 下载参数，传入将立即下载
 */
export const downloadFile = (query?: Record | { hash: string }): RequestResult => {
    const result = useRequest('/file/download', {
        method: "post",
        manual: !query,
        defaultParams: query,
        responseType: "blob",
        loadingDelay: 3000,
        onBefore: async () => {
            notice.success(t('loading'))
        },
        onSuccess(res: any) {
            notice.success(t('start_download'))
            fileDownload(res, getFileNameByResponse(result.response.value));
        }
    })
    return result
}

function getFileNameByResponse(response: any) {
    try {
        const str = response.headers['content-disposition']
        console.log(str)
        const match = str?.match(/(filename|filename\*)=[^=]+(.xlsx|.docx|.doc|.xls|.pptx|.ppt|.pdf|.xlsb|.xlsm|.xltx|.xltm|.txt|.png|.jpeg|.bmp|.gif|.jpg|.webp|.bmp|.zip|)$/)
        const filename = match ? match[0] : undefined
        return filename && decodeURIComponent(filename.replace(/(filename=|filename\*=|utf-8|"|')/g, ''))
    } catch (e) {
        return undefined
    }
}