import React from "react";
import { Host } from "react-native-portalize";

export default <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  class WithPotalHost extends React.Component<P> {
    render() {
      return (
        <Host>
          <WrappedComponent {...(this.props as P)} />
        </Host>
      );
    }
  };
