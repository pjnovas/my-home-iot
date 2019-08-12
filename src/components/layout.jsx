import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Classes, Colors } from '@blueprintjs/core';
import Header from 'components/header';

const GlobalStyle = createGlobalStyle`
  body {
    text-transform: none;
    line-height: 1.28581;
    letter-spacing: 0;
    font-size: 14px;
    font-weight: 400;
    background-color: ${Colors.DARK_GRAY3};
    font-family: sans-serif;
  }
`;

const Content = styled.div`
  padding-top: 50px;
`;

const Layout = ({ noHeader, children }) => (
  <div className={Classes.DARK}>
    {!noHeader && <Header />}
    <Content>
      {children}
    </Content>
    <GlobalStyle />
  </div>
);

export default Layout;
