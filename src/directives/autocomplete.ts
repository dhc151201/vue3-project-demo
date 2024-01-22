/**
 * 阻止表单input自动填充密码, v-stopAutocomplete
 * @param el 
 * @param param1 
 * @param vNode 
 */
const stopAutocomplete_directive = async (el: HTMLElement, { value }, vNode: any) => {

    const input: HTMLElement | null = el.tagName === 'INPUT' ? el : el.querySelector('input');
    if (!input) return;

    const setReadonly = () => {
        input?.setAttribute('readonly', 'readonly')
        input?.setAttribute('autocomplete', 'new-password')
    }
    const removeReadonly = () => {
        input?.removeAttribute('readonly')
    }

    setReadonly()
    input?.addEventListener('click', removeReadonly)
    input?.addEventListener('blur', setReadonly)

    vNode.__removeStopAutoplometeEvents = () => {
        input?.removeEventListener('click', removeReadonly)
        input?.removeEventListener('blur', setReadonly)
    }
}

export default (app: any) => {
    app.directive('stopAutocomplete', {
        beforeMount: stopAutocomplete_directive,
        beforeUnmount: (el: any, { value }, vNode: any) => {
            if (vNode.__removeStopAutoplometeEvents) {
                vNode.__removeStopAutoplometeEvents()
            }
        },
    })
}