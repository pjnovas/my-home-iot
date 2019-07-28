import React from 'react';
import styled from 'styled-components';
import { Intent, Tag, Colors } from "@blueprintjs/core";

const StatusCtn = styled.div`
  margin-bottom: 20px;
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${Colors.DARK_GRAY4};
  
  label {
    font-size: 1.4em;
    padding-right: 10px;
  }
`

const Status = ({ online }) => (
  <StatusCtn>
    <label>Status</label>
    <Tag
      large
      rightIcon={online ? 'tick-circle' : 'offline'}
      intent={online ? Intent.SUCCESS : Intent.DANGER}
      >{online ? 'ONLINE' : 'OFFLINE'}</Tag>
  </StatusCtn>
)

export default Status;