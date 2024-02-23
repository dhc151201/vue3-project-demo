import { isArray } from "@/utils"
import useRequest from "./useRequest"

const { run } = useRequest('/file/upload', {
    manual: true,
    method: "post",
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

export default async function (files: File | File[]) {
    const arr = []
    if (isArray(files)) {
        for (const file of (files as File[])) {
            arr.push(run({ file: file }))
        }
    } else if (files) {
        arr.push(run({ file: files }))
    }
    return Promise.all(arr)
}