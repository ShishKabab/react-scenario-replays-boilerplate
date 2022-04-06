import React, { ComponentType } from "react";
import ScenarioReplayContext, { ScenarioReplayContextData } from "./react-context";
import ComponentRegistry from "./registry";

interface State {
  test: boolean;
}

export function scenarioCallable() {
  return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const origFunction: (...args: any) => void = descriptor.value;
    descriptor.value = function (...args: any) {
      return origFunction.apply(this, args);
    };
  };
}

export function enableScenarios() {
  return <Props extends object>(WrappedComponent: ComponentType<Props>) => {
    return class ScenarioComponent<Props> extends React.Component<Props, State> {
      static contextType = ScenarioReplayContext;
      unregisterComponent?(): void;

      constructor(props: Props) {
        super(props);

        this.state = {
          test: true,
        };
      }

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
        return (
          <div>
            <div onClick={() => this.setState({ test: false })}>click me!</div>
            {this.state.test && <WrappedComponent ref={this.handleRef} {...(this.props as any)} />}
          </div>
        );
      }
    };
  };
}
