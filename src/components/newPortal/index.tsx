import React from 'react';
import ReactDOM from 'react-dom';

class NewPortal extends React.Component {

  private node: HTMLElement; 

  constructor(props: any) {
    super(props);
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(
      children,
      this.node,
    );
  }
}
export default NewPortal;