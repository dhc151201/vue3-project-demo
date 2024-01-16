import { ref } from "vue"

export const includes = ref<string[]>([]);


export function addKeepAliveCache(name: string) {
    if (includes.value.find(item => item === name)) return;
    includes.value.push(name);
}

export function removeKeepAliveCache(name: string) {
    const index: any = includes.value.findIndex(item => item === name)
    if([null, undefined].includes(index)) return
    includes.value.splice(index, 1);
}

export function clearKeepAliveCache() {
    includes.value = [];
}