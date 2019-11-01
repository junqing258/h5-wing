import React from "react";

interface ICompProps { }

interface ICompState {
  readonly Component?: keyof JSX.IntrinsicElements | any;
}

const AsyncComponent = (loadComponent: Function, loaddingComponent: any = null) =>
  class AsyncComponent extends React.Component<ICompProps, ICompState> {

    state: ICompState = {
      Component: null
    };

    public componentWillMount() {
      if (this.hasLoadedComponent()) {
        return;
      }

      loadComponent()
        .then((module: any) => module.default)
        .then((Component: any) => {
          this.setState({ Component });
        })
        .catch((err: any) => {
          console.error(`Cannot load component in <AsyncComponent />`);
          throw err;
        });
    }

    private hasLoadedComponent() {
      return this.state.Component !== null;
    }

    public render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : loaddingComponent;
    }
  };

export default AsyncComponent;
