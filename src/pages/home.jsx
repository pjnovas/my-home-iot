import React from 'react';
import styled from 'styled-components';
import Layout from 'components/layout';

const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100;

  font-size: 6em;
  color: #1d2c38;
  font-weight: bold;
  font-family: monospace;
`;

const Home = () => (
  <Layout noPad>
    <CenteredContent>IoT</CenteredContent>
  </Layout>
);

export default Home;
