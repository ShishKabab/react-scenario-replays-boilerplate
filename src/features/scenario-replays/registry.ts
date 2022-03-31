import React from "react";
import { ComponentSelector } from "./types";

export default class ComponentRegistry {
  generatedIds = 0;
  componentsById: { [id: number]: React.Component } = {};
  componentsByName: { [name: string]: { [id: number]: React.Component } } = {};

  register(component: React.Component) {
    const name = Object.getPrototypeOf(component).constructor.name;
    const id = ++this.generatedIds;
    this.componentsById[id] = component;
    this.componentsByName[name] = this.componentsByName[name] ?? {};
    this.componentsByName[name][id] = component;
    return () => {
      delete this.componentsById[id];
      delete this.componentsByName[name][id];
    };
  }

  async waitForComponent(componentName: string, selector?: ComponentSelector) {}

  async componentMethod(
    componentName: string,
    methodName: string,
    data: { [key: string]: any },
    selector?: ComponentSelector
  ) {}
}
