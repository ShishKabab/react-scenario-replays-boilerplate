import React from "react";
import { EventEmitter } from "../../utils/events";
import { ComponentSelector, WithComponentSelector } from "./types";
import { matchComponentSelector } from "./utils";

export interface ComponentRegistryEvents {
  registered: { component: React.Component & WithComponentSelector };
}
export default class ComponentRegistry {
  events = new EventEmitter<ComponentRegistryEvents>();

  generatedIds = 0;
  componentsById: { [id: number]: React.Component & WithComponentSelector } = {};
  componentsByName: { [name: string]: { [id: number]: React.Component & WithComponentSelector } } = {};

  register(component: React.Component & WithComponentSelector) {
    const name = Object.getPrototypeOf(component).constructor.name;
    const id = ++this.generatedIds;
    this.componentsById[id] = component;
    this.componentsByName[name] = this.componentsByName[name] ?? {};
    this.componentsByName[name][id] = component;
    this.events.emit("registered", { component });
    return () => {
      delete this.componentsById[id];
      delete this.componentsByName[name][id];
    };
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
