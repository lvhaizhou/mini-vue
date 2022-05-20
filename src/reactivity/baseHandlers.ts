import { track, trigger } from "./effect";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {

    if(key === "is_reactive") {
      return !isReadonly
    }

    const res = Reflect.get(target, key)
    if(!isReadonly) {
      // 依赖收集
      track(target, key)
    }

    return res;
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)

    // 触发依赖
    trigger(target, key)
    return res
  }
}


export const mutableHandlers = {
  get,
  set
}
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`readonly不能赋值：${target}`)
    return true
  },
}