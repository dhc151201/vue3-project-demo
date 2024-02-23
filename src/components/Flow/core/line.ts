/**
 * 画线类
 */
import {watch} from "vue"
import type { SopStepItem, SopSteps } from "@/types";
import { debounce } from "@/utils";
import i18n from "@/i18n"
const { locale } = i18n.global;

export default class {
    svgs: HTMLElement[] = [];
    constructor() { }
    drawLine(steps: SopSteps) {
        steps.forEach((step: SopStepItem) => {
            if (!step.pid) return;
            const fn = (pid: number) => {
                const parent = steps.find((_step: SopStepItem) => _step.node_id === pid)
                const start = parent?.element
                const end = step.element
                
                // console.log(start, end)
                if (!start || !end) return;
                /*
                const childNodesCount: number = steps.filter((_step: SopStepItem) => {
                    if (Array.isArray(_step.pid)) {
                        return _step.pid.includes(parent.node_id)
                    } else {
                        return _step.pid === parent.node_id
                    }
                }).length
                start.setAttribute('child-node-count', childNodesCount)
                end.setAttribute('parent-node-count', typeof step.pid === 'number' ? 1 : (step.pid?.length || 1))
                */
                const { svg } = new Line(
                    start,
                    end,
                    {
                        lineColor: ['rgba(100, 100, 100, 0.01)', 'rgba(100, 100, 100, 1)', 'rgba(100, 100, 100, 1)'],
                        lineType: "solid",
                        lineArrow: true,
                        lineGradient: true,
                        curve: true,
                    }
                );
                this.svgs.push(svg)
            }

            if (typeof step.pid === 'number') {
                fn(step.pid)
            } else {
                step.pid.forEach((pid?: number) => {
                    pid && fn(pid)
                })
            }
            
        })
    }
}


type options = {
    lineType?: "solid" | "dashed",
    lineColor?: string[],
    lineArrow?: boolean,
    lineGradient?: boolean,
    curve?:boolean
}
class Line {
    box?: HTMLElement;
    svg: any;
    line: any;
    makerId: string = "";
    linearGradientId: string = "";
    constructor(startElement: HTMLElement, endElement: HTMLElement, options: options = {}) {
        this.box = document.querySelector("#flox-box") as HTMLElement;
        this.box.style.position = "relative";

        this.svg = this.createSvg(startElement, endElement)
        if (options.lineGradient) {
            const linearGradient = this.createLinearGradient(options)
            this.svg.appendChild(linearGradient)
        }
        if (options.lineArrow) {
            const marker = this.createMaker(options)
            this.svg.appendChild(marker)
        }
        this.line = this.createLine(options)
        this.update(startElement, endElement, options)
        this.svg.appendChild(this.line)


        this.box?.appendChild(this.svg)
        // document.body.style.position = "relative";
        // document.body.appendChild(this.svg)

        const updateHandel: any = debounce(() => {
            this.update(startElement, endElement, options)
        }, 0)
        window.addEventListener("resize", updateHandel)
        watch(locale, () => {
            updateHandel()
        })
    }
    getElememtStyle(el: HTMLElement) {
        const style = window.getComputedStyle(el);
        const data: any = {
            w: parseInt(style.width),
            h: parseInt(style.height),
            x: el.offsetLeft,
            y: el.offsetTop
        }
        let parentNode: any = el.parentNode
        if (parentNode !== this.box) {
            data.x += parentNode.offsetLeft
            data.y += parentNode.offsetTop
            parentNode = parentNode.parentNode
        }
        return data
    }
    getSvgAttr(startElement: HTMLElement, endElement: HTMLElement) {
        const start = this.getElememtStyle(startElement);
        const end = this.getElememtStyle(endElement);
        
        // console.log(start)
        // 结束在开始的右边
        if (end.x > start.x + (start.w / 2)) {
            return {
                x: start.x + start.w / 2,
                y: Math.min(start.y, end.y) + start.h,
                w: Math.abs(end.x - start.x),
                h: Math.abs(end.y - start.y - end.h),
                type: "right"
            }
        }
        // 结束在开始的左边
        if (end.x + end.w / 2 < start.x) {
            return {
                x: end.x + end.w / 2,
                y: Math.min(start.y, end.y) + start.h,
                w: Math.abs(start.x - end.x),
                h: Math.abs(end.y - start.y - start.h),
                type: "left"
            }
        }
        // 重叠
        return {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y) + start.h,
            w: Math.max(start.w, end.w),
            h: Math.abs(end.y - start.y - start.h),
            type: "cover"
        }
    }
    createSvg(startElement: HTMLElement, endElement: HTMLElement) {
        const SVG_NS = "http://www.w3.org/2000/svg"
        const svg = document.createElementNS(SVG_NS, 'svg')
        svg.setAttribute("class", "steps-line")
        svg.setAttribute("style", "position: reative; z-index: 1;")
        svg.setAttribute("shape-rendering", "geometricPrecision")
        return svg;
    }
    createLine(options: options = {}) {
        const SVG_NS = "http://www.w3.org/2000/svg"

        const path = document.createElementNS(SVG_NS, 'path')
        path.setAttribute('stroke-width', "2")
        path.setAttribute('fill', "none")
        // 设置渐变
        if (options.lineGradient) {
            path.setAttribute('stroke', `url(#${this.linearGradientId})`) // 设置渐变
        } else {
            path.setAttribute('stroke', "rgba(200, 200, 200 ,.5)")
        }
        // 设置箭头
        if (options.lineArrow) {
            path.setAttribute("marker-end", `url(#${this.makerId})`)
        }
        // 设置虚线
        if (options.lineType === "dashed") {
            path.setAttribute("style", `stroke-dasharray: 4;`)
        }
        return path
    }
    update(startElement: HTMLElement, endElement: HTMLElement, options: options = {}) {
        const { w, h, x, y, type } = this.getSvgAttr(startElement, endElement)
        if (isNaN(w)) {
            this.svg.style.display = 'none'
            return;
        }

        this.svg.setAttribute("style", `position: absolute; 
            width: ${w + 10}px; 
            height: ${h + 5}px; 
            left: ${x - 2}px; 
            top: ${y}px;`
        )
        /*
        const childNodesCount = Number(startElement.getAttribute('child-node-count'))
        const parentNodeCount = Number(endElement.getAttribute('parent-node-count'))
        */
        const offset: number = 4
        // 路径绘制
        if (type == "left") {
            /*
            const startZIndex = this.line.startZIndex ?? Number(startElement.getAttribute('child-left-nodes') || 0)
            startElement.setAttribute('child-left-nodes', (startZIndex + 1).toString())
            const endZIndex = this.line.endZIndex ?? Number(endElement.getAttribute('parent-right-nodes') || 0)
            endElement.setAttribute('parent-right-nodes', (endZIndex + 1).toString())
            */
            if (options.curve) { 
                this.line.setAttribute('d', `
                    M ${w + offset} 0 
                    V ${h * 0.5 + 1}
                    H ${offset}
                    V ${h - 2}`)
                /*
                const startx = childNodesCount === 1 ? w : w - 10 - startZIndex * 10
                const endx = parentNodeCount === 1 ? 5 : 15 + endZIndex * 10
                if (parentNodeCount > 1) {
                    this.line.setAttribute('d', `
                    M ${startx} 0 
                    V ${h * 0.5 + endZIndex * 10 + 1} 
                    M ${startx + 1} ${h * 0.5 + endZIndex * 10} 
                    H ${endx}
                    V ${h - 2}`)
                } else {
                    this.line.setAttribute('d', `
                    M ${startx} 0 
                    V ${h * 0.5 - startZIndex * 10 + 1} 
                    M ${startx + 1} ${h * 0.5 - startZIndex * 10} 
                    H ${endx}
                    V ${h - 2}`)
                }
                this.line.startZIndex = startZIndex
                this.line.endZIndex = endZIndex
                */
            } else {
                this.line.setAttribute('d', `M ${w} 1.5 L 0 ${h - 2}`)
            }
        } else if (type == "right") {
            /*
            const startZIndex = this.line.startZIndex ?? Number(startElement.getAttribute('child-right-nodes') || 0)
            startElement.setAttribute('child-right-nodes', (startZIndex + 1).toString())
            const endZIndex = this.line.endZIndex ?? Number(endElement.getAttribute('parent-left-nodes') || 0)
            endElement.setAttribute('parent-left-nodes', (endZIndex + 1).toString())
            */
            if (options.curve) {
                this.line.setAttribute('d', `
                    M ${offset} 0 
                    V ${h * 0.5 + 1}
                    H ${ w + offset } 
                    V ${h - 2}`)
                /*
                const startx = childNodesCount === 1 ? 4 : 20 + startZIndex * 10
                const endx = parentNodeCount === 1 ? w : w - 5 - endZIndex * 10
                if (parentNodeCount > 1) {
                    this.line.setAttribute('d', `
                    M ${startx} 0 
                    V ${h * 0.5 + endZIndex * 10 + 1} 
                    M ${startx - 1} ${h * 0.5 + endZIndex * 10} 
                    H ${ endx } 
                    V ${h - 2}`)
                } else {
                    this.line.setAttribute('d', `
                    M ${startx} 0 
                    V ${h * 0.5 - startZIndex * 10 + 1} 
                    M ${startx - 1} ${h * 0.5 - startZIndex * 10} 
                    H ${ endx } 
                    V ${h - 2}`)
                }
                this.line.startZIndex = startZIndex
                this.line.endZIndex = endZIndex
                */
            } else {
                this.line.setAttribute('d', `M 0 1.5 L ${w} ${h - 2}`)
            }
        } else {
            this.line.setAttribute('d', `M ${w / 2 + offset } 0 L ${w / 2 + offset + 0.111} ${h - 2}`)
        }
    }
    createLinearGradient(options: options) {
        const SVG_NS = "http://www.w3.org/2000/svg"
        const linearGradient = document.createElementNS(SVG_NS, 'linearGradient')
        this.linearGradientId = "linear_" + new Date().getTime() + Math.ceil(Math.random() * 1000000);
        linearGradient.setAttribute("id", this.linearGradientId);
        linearGradient.setAttribute("x1", "0");
        linearGradient.setAttribute("y1", "0");
        linearGradient.setAttribute("x2", "0");
        linearGradient.setAttribute("y2", "1");

        const start = document.createElementNS(SVG_NS, 'stop')
        start.setAttribute("offset", "0");
        start.setAttribute("stop-color", options.lineColor ? options.lineColor[0] : "rgba(200, 200, 200, 0.01)");

        const middle = document.createElementNS(SVG_NS, 'stop')
        middle.setAttribute("offset", "0.3");
        middle.setAttribute("stop-color",  options.lineColor ? options.lineColor[1] : "rgba(200, 200, 200, 0.5)");

        const end = document.createElementNS(SVG_NS, 'stop')
        end.setAttribute("offset", "1");
        end.setAttribute("stop-color",  options.lineColor ? options.lineColor[2] : "#747474");

        linearGradient.appendChild(start)
        linearGradient.appendChild(middle)
        linearGradient.appendChild(end)

        const defs = document.createElementNS(SVG_NS, 'defs')
        defs.appendChild(linearGradient)

        return defs;
    }
    createMaker(options: options) {
        const SVG_NS = "http://www.w3.org/2000/svg"
        const maker = document.createElementNS(SVG_NS, 'marker')
        const color = options.lineColor ? options.lineColor[2] : "#747474" // 箭头颜色
        this.makerId = "maker_" + Math.ceil(Math.random() * 99999999)
        maker.setAttribute('id', this.makerId)
        maker.setAttribute('fill', color)
        maker.setAttribute('viewBox', "0 0 10 10")
        maker.setAttribute('refX', "8")
        maker.setAttribute('refY', "5")
        maker.setAttribute('markerWidth', "3")
        maker.setAttribute('markerHeight', "3")
        maker.setAttribute('orient', "auto")

        const makerPath = document.createElementNS(SVG_NS, 'path')
        makerPath.setAttribute('stroke', color)
        makerPath.setAttribute('d', "M 0 0 L 10 5 L 0 10 z")
        makerPath.setAttribute('fill', color)

        maker.appendChild(makerPath)

        return maker;
    }
}
