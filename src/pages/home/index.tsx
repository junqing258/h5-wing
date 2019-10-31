import React, { useState, useEffect } from 'react';
// import { DatePicker, List } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import './style.scss';
import Topbar from 'components/top/Topbar';
import { Floor } from 'components/floor/Floor';
// import { Link } from 'react-router-dom';

import Modal from 'components/modal';

export default function Home() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [time, setTime] = useState(0);

  const openModal = () => setVisibleModal(true);
  const closeModal = () => setVisibleModal(false);

  useEffect(() => {
    let c = time;
    let tid = setInterval(() => {
      setTime(c+=1);
    }, 1000);
    return () => clearInterval(tid); 
  }, []);

  useEffect(() => {
    document.title = `${time} sec`;
  }, [time]);

  return (
    <div className="page">
      <Topbar title="健康医疗"/>

      <div className="row justify-content-center entra">
        <img src={require('assets/quick_start/entra_1.png')} alt="" />
        <img src={require('assets/quick_start/entra_2.png')} alt="" />
      </div>

      <div className="banner-inquiry">
        <img src={require('assets/quick_start/f_advisory.png')} alt="" />
      </div>

      <Floor className="prod-list" 
        title="健康商城">
        <img src={require('assets/quick_start/prod_1.png')} alt="" 
          onClick={openModal}/>
        <img src={require('assets/quick_start/prod_2.png')} alt="" />
      </Floor>


      <Modal
        show={visibleModal}
        title="这是自定义title"
        confirm={closeModal}
        onClose={closeModal} >
        这是自定义content
      </Modal>

    </div>
  );
}
