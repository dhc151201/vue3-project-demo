/**
 * 去除两边空格
 * <el-input v-model="xxx" v-trim></el-input>
 */

function getInput(el: HTMLElement): HTMLElement | null {
    let inputEle;
    const { tagName } = el;
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
        inputEle = el;
    } else {
        inputEle = el.querySelector("input");
        if (!inputEle) {
            inputEle = el.querySelector("textarea");
        }
    }
    return inputEle;
}

function dispatchEvent(el: HTMLElement | null, type: string) {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(type, true, true);
    el?.dispatchEvent(evt);
}

const Trim = {
    mounted: (el: any) => {
        if (!el) return;
        const inputEle = getInput(el);
        const handler = function (event: any) {
            const newVal = event.target.value.trim();
            if (event.target.value != newVal) {
                event.target.value = newVal;
                dispatchEvent(inputEle, "input");
            }
        };
        el.inputEle = inputEle;
        el._blurHandler = handler;
        inputEle?.addEventListener("blur", handler);
    },

    beforeUnmount(el: any) {
        const { inputEle } = el;
        inputEle?.removeEventListener("blur", el._blurHandler);
    },
};

export default function (app: any) {
    app.directive('trim', Trim)
};