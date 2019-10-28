import React, { Component } from 'react';
import NewPortal from '../newPortal';
// import Transition from '../transition';
import { CSSTransition } from 'react-transition-group';

import './modal.css';

class Modal extends Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.maskClick = this.maskClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    // this.setState({ visible: this.props.visible });
  }

  // componentWillReceiveProps(props) {
  //   this.setState({ visible: props.visible });
  // }

  static getDerivedStateFromProps(nextProps, state) {
    return { visible: nextProps.show };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  openModal() {
    const { onOpen } = this.props;
    onOpen && onOpen();
    this.setState({ visible: true });
  }

  closeModal() { 
    const { onClose } = this.props;
    onClose && onClose();
    this.setState({ visible: false });
  }

  confirm() {
    const { confirm } = this.props;
    confirm && confirm();
    this.setState({ visible: false });
  }

  maskClick() {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;

    const { title, children } = this.props;
    return <NewPortal>
      {/* 引入transition组件，去掉了外层的modal-wrapper */}
      <CSSTransition
        in={visible}
        classNames="alert"
        timeout={300}
        // transitionEnterTimeout={200}
        // transitionLeaveTimeout={200}
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
    </NewPortal>;
  }
}
export default Modal;