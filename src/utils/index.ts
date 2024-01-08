export const isObject = function (val: any): boolean {
  return Object.prototype.toString.call(val) === "[object Object]";
};
/**
 * 检测是否是一个空对象
 * @param str 检测对象
 * @returns boolean
 */
export const isEmptyObject = function (val: any): boolean {
  return isObject(val) && Object.keys(val).length === 0;
};
/**
 * 检测是否是一个空值（有key但值为空）的对象（包含空对象）
 * @param str 检测对象
 * @returns boolean
 */
export const isEmptyValueObject = function (val: any): boolean {
  if (isEmptyObject(val)) return true
  const values = Object.values(val).filter((v: any) => ![undefined, null, ""].includes(v))
  return values.length === 0;
};
export const isArray = function (val: any): boolean {
  return Array.isArray(val);
};
export const isString = function (val: any): boolean {
  return typeof val === "string";
};
export const isJsonString = function (val: any): boolean {
  return typeof val === "string" && /^({|\[).*(}|])$/.test(val);
};
export const isFunction = function (val: any): boolean {
  return val && typeof val === "function";
};
export const isBoolern = function (val: any): boolean {
  return val === false || val === true
}

/**
 * 检测是否包含中文
 * @param str 检测字符串
 * @returns boolean
 */
export const isIncludesChinase = (str: string): boolean => {
  const reg = new RegExp("[\\u4E00-\\u9fa5]+", "gi");
  return reg.test(str)
}
/**
 * 检测是否包含英文
 * @param str 检测字符串
 * @returns boolean
 */
export const isIncludesEnglish = (str: string): boolean => {
  const reg = new RegExp("[A-Za-z]+", "g");
  return reg.test(str)
}
/**
 * 检测是否包含特殊字符(除了字母、数字以外的字符)
 * @param str 检测字符串
 * @returns boolean
 */
export const isIncludesSpecialChar = (str: string): boolean => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}
/**
 * 检测是否是邮箱
 * @param str 检测字符串
 * @returns  boolean 
 */
export const isEmailStr = (str: string): boolean => {
  return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(str)
}
/**
 * 检测是否是图片
 * @param file_name 文件名称
 * @returns  boolean
 */
export const isPicture = (file_name: string): boolean => {
  return /(.png|.jpeg|.bmp|.gif|.jpg|.webp)/.test(file_name)
}
/**
 * 检测有个对象中，是否存在指定的key值
 * @param val 检测的对象
 * @param key 指定的key值
 * @returns boolean
 */
export const hasKey = (val: any, key: string): boolean => {
  return isObject(val) && Object.keys(val).includes(key)
}
export const runFunction = (fun: any, ...args: any[]) => {
  if (!isFunction(fun)) return;
  return fun(...args);
};

/**
 * 必须是一个对象，否则将返回一个空对象
 */
export const mastObject = (val: any) => {
  if (!isObject(val)) return {}
  return val
}

/**
 * 异步等待
 * @param time 等待时间ms
 * @returns 
 */
export const awaitTime = function (time: number) {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(1);
    }, time);
  });
};

/**
 * 防抖
 * @param fun 执行函数
 * @param wait 防抖时间（触发或再次触发后，重新计算多少时间后执行）
 * @returns 
 */
export const debounce = function (fun: Function, wait?: number) {
  if (!wait) return fun;
  let timer: any;
  return (...args: any[]) => {
    return new Promise((reslove) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await fun(...args);
        reslove(result);
      }, wait);
    });
  };
};

/**
 * 节流
 * @param fun 执行函数
 * @param wait 限流时间（本次执行与下次执行的间隔时间）
 * @returns 
 */
export const throttle = function (fun: Function, wait?: number) {
  if (!wait) return fun;
  let time1 = 0;
  return (...args: any[]) => {
    const time2 = Date.now();
    const timeInterval = time2 - time1;
    if (timeInterval < wait) {
      return;
    } else {
      time1 = time2;
      return fun(...args);
    }
  };
};

/**
 * 深拷贝
 * @param obj 拷贝对象
 * @returns 一个新对象
 */
export const cloneDeep = function (obj: any) {
  if (!(isObject(obj) || isArray(obj))) return obj;

  const res: any = isObject(obj) ? {} : [];

  for (const key in obj) {
    if (isObject(obj[key]) || isArray(obj[key])) {
      res[key] = cloneDeep(obj[key]);
    } else {
      res[key] = obj[key];
    }
  }

  return res;
};

/**
 * 文件对象上传前后对比（预防上传选择文件后进行内容修改）
 * @param files 文件对象
 * @returns 
 */
export const diffFiles = function (files: File[]): Promise<File[] | null> {
  const arr: any[] = []
  for (const file of files) {
    const task = new Promise((reslove, reject) => {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => reslove(file);
      reader.onerror = () => {
        reject(file);
      }
    })
    arr.push(task)
  }
  return Promise.allSettled(arr).then((res: { status: string }[]) => {
    const files: File[] = res.filter((r: any) => r.status === 'rejected').map((r: any) => r.reason)
    return files.length > 0 ? files : null
  })
}

/**
 * 比较俩个对象之间的差异
 * 如果数据改动，则返回新旧对象记录改动字段的新旧值
 * @param obj1 比较对象1
 * @param obj2 比较对象2
 * @returns null | {old_val: any, new_val: any}
 */
export const diffObj = function (obj1: any, obj2: any) {
  function getTypeByObj(obj: any): any {
    const result = Object.prototype.toString.call(obj).match(/^\[object ([a-zA-Z]*)\]$/)
    return result ? result[1] : null;
  }
  function isEmptyObject(obj: any) {
    for (const key in obj) {
      return !key;
    };
    return true;
  }
  if (!obj1 || isEmptyObject(obj1) || !obj2 || isEmptyObject(obj2)) {
    return null;
  }
  const diffRes: any = {
    old_val: {},
    new_val: {}
  };
  for (const k in obj2) {
    // 判断数据类型是否一致
    if (getTypeByObj(obj2[k]) === getTypeByObj(obj1[k])) {
      // 比较 “Array”和“Object”类型
      if (getTypeByObj(obj2[k]) === 'Array' || getTypeByObj(obj2[k]) === 'Object') {
        const diffData = diffObj(obj1[k], obj2[k]);
        if (!isEmptyObject(diffData)) {
          diffRes.old_val[k] = diffData.old_val;
          diffRes.new_val[k] = diffData.new_val;
        }
      } else if (obj1[k] !== obj2[k]) { // 比较其他类型数据
        diffRes.old_val[k] = obj1[k];
        diffRes.new_val[k] = obj2[k];
      }
    } else {
      if ([undefined, null, ''].includes(obj1[k]) && [undefined, null, ''].includes(obj2[k])) {
        // 这三类数据可视为相等，不做处理
      } else {
        diffRes.old_val[k] = obj1[k];
        diffRes.new_val[k] = obj2[k];
      }
    }
  }
  // 若没有变化，返回null
  if (isEmptyObject(diffRes.old_val) || isEmptyObject(diffRes.new_val)) {
    return null;
  }
  return diffRes;
}

/**
 * 文件转base64
 * @param file 
 * @returns 
 */
export const fileToBase64 = (file: File) => {
  return new Promise((reslove) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //转化二进制流，异步方法
    reader.onload = function () {
      //完成后this.result为二进制流
      const base64Str: any = this.result;
      let startNum = base64Str.indexOf("base64,");
      startNum = startNum * 1 + 7;
      //去除前部格式信息（如果有需求）
      const baseStr = base64Str.slice(startNum);
      // console.log(baseStr,"二进制数据！！！")
      reslove(baseStr)
    }
  })

}

/**
 * 表单多文件上传的数据转换。fileNames中定义的文件key，需要跟传入数据的文件key值相同
 * @param obj 数据对象
 * @returns {content: JSONstring, content_* : File[]}
 */
export const getFormValuesByContent = (obj: {
  fileNames: string[],
  [key: string]: any
}) => {
  const result: any = {
    content: {}
  };
  for (const key in obj) {
    if (key === "fileNames") {
      result.content.file_fields = obj[key]
      obj[key].forEach((fileName: string) => {
        result[`content_${fileName}`] = obj[fileName]
      })
    } else if (!obj.fileNames.includes(key)) {
      result.content[key] = obj[key]
    }
  }
  result.content = JSON.stringify(result.content)
  return result;
}

/**
 * 尝试移除数组中的某一项
 * @param arr 被执行移除的数组对象
 * @param target 移除的值（不是key值）
 */
export const tryRemoveItemArray = (arr: any[], target: any) => {
  if (arr.includes(target)) {
    arr.splice(arr.findIndex((v: any) => v === target), 1)
  }
}

/**
 * 从地址栏获取参数
 * @param name 参数名称
 * @returns undefined | string
 */
export const getUrlQueryParams = (name: string): string | undefined => {
  const reg = new RegExp(name + "=[^&]*", "i");
  const r = window.location.href.match(reg)
  if (r) return r[0].replace(new RegExp(name + "=", "i"), '');
  return undefined;
}