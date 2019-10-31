// import React from 'react';
// import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Home from '../../pages/home/index';

test('home page', () => {
  const div = document.createElement('div');
  const wrapper = shallow(<Home />);
  expect(wrapper.find('.page')).to.have.lengthOf(1);
  // ReactDOM.render(<Main />, div);
  // ReactDOM.unmountComponentAtNode(div);
});
