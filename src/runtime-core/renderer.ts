import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  console.log(vnode.type);
  if (typeof vnode.type === "string") {
    // 处理元素
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 处理组件
    processComponent(vnode, container)
  }

}

function processComponent(vnode, container) {
  // 挂载组件
  mountComponent(vnode, container)
  // TODO 更新组件
}

function processElement(vnode, container) {
  // element 类型也分为 mount 和 update，这里先实现mount
  mountElement(vnode, container)

  // TODO 更新element
  // updateElement()
}


function mountComponent(vnode: any, container: any) {
  // 抽离出 instance 实例，表示组件实例
  const instance = createComponentInstance(vnode)
  // 安装component
  setupComponent(instance)
  // 安装render
  setupRenderEffect(instance, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)
  // children可能是：string、array
  const { props, children }  = vnode

  if(typeof children === "string") {
    el.textContent = children
  } else if(Array.isArray(children)) {
    // children 中每个都是 vnode，需要继续调用 patch，来判断是element类型还是component类型，并对其初始化
    // 重构：children.forEach(v => patch(v, el))
    mountChildren(vnode, el)
  }

  // props
  for (const key in props) {
    const value = props[key]
    el.setAttribute(key, value)
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => patch(v, container))
}

function setupRenderEffect(instance, container) {
  // 获取render函数的返回值（返回的是组件的虚拟节点树）
  const subTree = instance.render()
  // 基于返回的虚拟节点，对其进行patch比对（打补丁）
  patch(subTree, container)
}
