import React from 'react';
import { createRoot } from 'react-dom/client';
import Storefront from './components/Storefront.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(React.createElement(Storefront));
