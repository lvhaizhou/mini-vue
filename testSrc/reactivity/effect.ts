import { extend } from "../shared/index";
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active: boolean = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      if (this.onStop) {
        this.onStop();
      }
      clearupEffect(this);
      this.active = false;
    }
  }
}

function clearupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

let targetMap = new Map();
let activeEffect;

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);  1
  }

  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  runner._effect.stop();
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner._effect = _effect;
  return runner;
}