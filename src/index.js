import React from 'react';
import ReactDOM from 'react-dom/client';
import CropImg from './cropImg';
import { Header } from './Header';
import Footer from "./Footer";
import Content from "./Content";
import Style from "./css/master.module.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <div>

          <Content />
          <Footer />
      </div>
);

