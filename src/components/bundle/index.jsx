/**
 * 按需加载
 * 
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Bundle extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      comp: null
    };
  }

  componentWillMount() {
    // 加载初始状态
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    // 重置状态
    this.setState({
      comp: null
    });

    // 传入组件的组件
    props.load((comp) => {
      comp = comp.default ? comp.default : comp;

      this.setState({
        comp: props.subKey ? comp[props.subKey] : comp
      });
    });
  }

  render() {
    return this.state.comp ? this.props.children(this.state.comp) : null;
  }
}

Bundle.propTypes = {
  load: PropTypes.func,
  children: PropTypes.func,
  subKey: PropTypes.string
};

const Loading = () => <div>Loading...</div>;

export function lazyLoad(impComp, subKey = null) {
  return function(props) {
    return <Bundle load={impComp} subKey={subKey}>
      {Comp => (Comp ? <Comp {...props} /> : <Loading />)}
    </Bundle>;
  };
}
