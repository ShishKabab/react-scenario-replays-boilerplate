import React from "react";

export default class ComponentRegistry {
  register(component: React.Component) {
    const componentName = Object.getPrototypeOf(component).constructor.name;
    console.log("component registered!", componentName);
    return () => {};
  }
}
