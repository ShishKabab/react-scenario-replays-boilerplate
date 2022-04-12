import React from "react";
import { EventEmitter } from "../../utils/events";
import { ComponentSelector, ComponentSignal, SignalSelector, WithComponentSelector } from "./types";
import { matchComponentSelector } from "./utils";

export interface ComponentRegistryEvents {
  registered: { component: React.Component & WithComponentSelector };
  signal: { componentId: number; signal: ComponentSignal };
}
export default class ComponentRegistry {
  events = new EventEmitter<ComponentRegistryEvents>();

  generatedIds = 0;
  componentsById: { [id: number]: React.Component & WithComponentSelector } = {};
  componentsByName: { [name: string]: { [id: number]: React.Component & WithComponentSelector } } = {};
  emittedSignals: { [componentId: number]: Array<ComponentSignal> } = {};

  registerComponent(component: React.Component & WithComponentSelector) {
    const name = Object.getPrototypeOf(component).constructor.name;
    const id = ++this.generatedIds;
    this.componentsById[id] = component;
    this.componentsByName[name] = this.componentsByName[name] ?? {};
    this.componentsByName[name][id] = component;
    this.emittedSignals[id] = [];
    this.events.emit("registered", { component });
    return {
      id,
      unregister: () => {
        delete this.componentsById[id];
        delete this.componentsByName[name][id];
        delete this.emittedSignals[id];
      },
    };
  }

  emitSignal(componentId: number, signal: ComponentSignal) {
    this.emittedSignals[componentId].push(signal);
    this.events.emit("signal", { componentId, signal });
  }

  getComponent(componentName: string, selector?: ComponentSelector) {
    selector = selector ?? {};
    for (const component of Object.values(this.componentsByName[componentName] ?? {})) {
      if (matchComponentSelector(component.componentSelector ?? {}, selector)) {
        return component;
      }
    }

    return null;
  }

  hasEmittedSignal(componentId: number, searchSignal: ComponentSignal) {
    const selector = searchSignal.selector ?? {};
    for (const emittedSignal of Object.values(this.emittedSignals[componentId] ?? {})) {
      if (matchComponentSelector(emittedSignal.selector ?? {}, selector)) {
        return true;
      }
    }

    return false;
  }

  async waitForComponent(componentName: string, selector?: ComponentSelector) {
    selector = selector ?? {};

    const existingComponent = this.getComponent(componentName, selector);
    if (existingComponent) {
      return existingComponent;
    }

    return new Promise<React.Component>((resolve) => {
      const unsubscribe = this.events.on("registered", ({ component }) => {
        if (matchComponentSelector(component.componentSelector ?? {}, selector!)) {
          unsubscribe();
          resolve(component);
        }
      });
    });
  }

  async waitForSignal(componentName: string, componentSelector: ComponentSelector, searchSignal: ComponentSignal) {
    const rawComponent = await this.waitForComponent(componentName, componentSelector);
    const component = rawComponent as React.Component & { _componentId: number };
    const searchComponentId = component._componentId;
    if (this.hasEmittedSignal(searchComponentId, searchSignal)) {
      return;
    }

    return new Promise<void>((resolve) => {
      const unsubscribe = this.events.on("signal", ({ componentId, signal }) => {
        let match = componentId === searchComponentId;
        match &&= signal.name === searchSignal.name;
        match &&= matchComponentSelector(signal.selector ?? {}, searchSignal.selector ?? {});
        if (match) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  async componentMethod(
    componentName: string,
    methodName: string,
    data: { [key: string]: any },
    selector?: ComponentSelector
  ) {
    const component = (await this.waitForComponent(componentName, selector)) as any;
    await component[methodName](data);
  }
}
