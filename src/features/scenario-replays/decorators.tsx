import React, { ComponentType } from "react";
import ScenarioReplayContext, { ScenarioReplayContextData } from "./react-context";
import ComponentRegistry from "./registry";

export function scenarioCallable() {
  return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const origFunction: (...args: any) => void = descriptor.value;
    descriptor.value = function (...args: any) {
      return origFunction.apply(this, args);
    };
  };
}

export function scenarioComponent() {
  return <Props extends object>(WrappedComponent: ComponentType<Props>) => {
    return class ScenarioComponent<Props> extends React.Component<Props> {
      static contextType = ScenarioReplayContext;
      unregisterComponent?(): void;

      handleRef = (ref: React.Component & { _componentRegistry?: ComponentRegistry }) => {
        const { componentRegistry } = this.context as ScenarioReplayContextData;
        if (ref) {
          ref._componentRegistry = componentRegistry;
          this.unregisterComponent = componentRegistry?.register(ref);
        } else {
          this.unregisterComponent?.();
          delete this.unregisterComponent;
        }
      };

      render() {
        return <WrappedComponent ref={this.handleRef} {...(this.props as any)} />;
      }
    };
  };
}
