import React, { PureComponent } from 'react';
import NewPortal from '../newPortal';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import './modal.css';

export type IProps = {
  title?: string;
  show: boolean;
  setShow: Function;
  onClose?: Function;
  onConfirm?: Function;
}

export interface IState {
  visible: boolean;
}

export class Modal extends PureComponent<IProps, IState> {
  boxDOM: any;

  state = {
    visible: false,
  };

  constructor(props: IProps) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.maskClick = this.maskClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.boxDOM = React.createRef();
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.show !== state.visible) {
      return {
        visible: props.show,
      };
    }
    return null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(prevProps.show!==this.props.show){
  //     this.setState({visible: prevProps.show});
  //   }
  // }

  closeModal() {
    const { setShow } = this.props;
    setShow && setShow(false);
  }

  confirm() {
    const { onConfirm, setShow } = this.props;
    onConfirm && onConfirm();
    setShow && setShow(false);
  }

  maskClick() {
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
          onEnter={node => {
            node.style.display = 'block';
          }}
          onExited={node => {
            node.style.display = 'none';
          }}
        >
          <div ref={this.boxDOM} className="modal" style={{ display: "none" }}>
            <div className="modal-title">{title}</div>
            <div className="modal-content">{children}</div>
            <div className="modal-operator">
              <button onClick={this.closeModal} className="modal-operator-close">
                取消
              </button>
              <button onClick={this.confirm} className="modal-operator-confirm">
                确认
              </button>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={visible}
          classNames="mask"
          timeout={300}
          onEnter={node => {
            node.style.display = 'block';
          }}
          onExited={node => {
            node.style.display = 'none';
          }}
        >
          <div className="mask" style={{ display: "none" }} onClick={this.maskClick}></div>
        </CSSTransition>
      </NewPortal>
    );
  }
}


/*export const withModal = (WrappedComponent: React.Component) => {

  return class ModalHOC extends React.Component {

    constructor(props) {
      super(props);
    }

    show() {

    }

    close() {

    }

    render() {
      return (
        <Modal
          show={visibleModal}
          setShow={setVisibleModal}
          title="这是自定义title"
          onConfirm={()=> {}}
          onClose={() => {}} 
        >
          {{WrappedComponent}}
        </Modal>
     )
    }

  }
}   */

    
 
  
