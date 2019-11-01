import React, { Component } from 'react';
import NewPortal from '../newPortal';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import './modal.css';

export interface IProps {
  title?: string;
  onClose?: Function;
  confirm?: Function;
}

export interface IState {
  visible: boolean
}

export default class Modal extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.maskClick = this.maskClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      visible: false
    };
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.show !== state.visible) {
      return { visible: props.show };
    }
    return null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(prevProps.show!==this.props.show){
  //     this.setState({visible: prevProps.show});
  //   }
  // }

  closeModal() { 
    const { onClose } = this.props;
    onClose && onClose();
    // this.setState({ visible: false });
  }

  confirm() {
    const { confirm } = this.props;
    confirm && confirm();
    // this.setState({ visible: false });
  }

  maskClick() {
    // this.setState({ visible: false });
    this.closeModal();
  }

  render() {
    const { visible } = this.state;

    const { title, children } = this.props;
    return (
      <NewPortal>
        <CSSTransition
          in={visible}
          classNames="alert"
          timeout={300}
        >
          <div className={`modal m-${visible? "show": "hide"}`}>
            <div className="modal-title">{title}</div>
            <div className="modal-content">{children}</div>
            <div className="modal-operator">
              <button
                onClick={this.closeModal}
                className="modal-operator-close"
              >取消</button>
              <button
                onClick={this.confirm}
                className="modal-operator-confirm"
              >确认</button>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={visible}
          classNames="mask"
          timeout={300}
        >
          <div className={`mask m-${visible? "show": "hide"}`} 
            onClick={this.maskClick} ></div>
        </CSSTransition>
      </NewPortal>
    );
  }
}
