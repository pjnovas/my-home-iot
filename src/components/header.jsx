import React from 'react';
import { connect } from 'react-redux';

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup
} from "@blueprintjs/core";

const NavMenuItem  = connect(
  (state, ownProps) => ({
    className: Classes.MINIMAL,
    active: state.location.type === ownProps.to
  }),
  (dispatch, ownProps) => ({
    onClick: () => dispatch({ type: ownProps.to })
  })
)(Button);

const Header = () => (
  <Navbar fixedToTop>
    <NavbarGroup align={Alignment.LEFT}>
      <NavMenuItem large icon="cell-tower" to="PAGE_TOWER" />
      <NavMenuItem large icon="flash" to="PAGE_HEATER" />
      <NavMenuItem large icon="lightbulb" to="PAGE_LIGHT" />
      <NavMenuItem large icon="power" to="PAGE_POWER" />
      <NavMenuItem large icon="chart" to="PAGE_TOWER_LOGS" />
    </NavbarGroup>
  </Navbar>
)

export default Header;