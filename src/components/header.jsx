import React from 'react';
import { connect } from 'react-redux';
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
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
    <NavbarHeading>IoT</NavbarHeading>
    <NavbarDivider />
      <NavMenuItem icon="cell-tower" text="Tower" to="PAGE_TOWER" />
      <NavMenuItem icon="flash" text="Heater" to="PAGE_HEATER" />
      <NavMenuItem icon="power" text="Power" to="PAGE_POWER" />
    </NavbarGroup>
  </Navbar>
)

export default Header;