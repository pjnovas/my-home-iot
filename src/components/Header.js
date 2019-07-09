import React from 'react';
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
} from "@blueprintjs/core";

const Header = () => (
  <Navbar fixedToTop>
    <NavbarGroup align={Alignment.LEFT}>
    <NavbarHeading>IoT</NavbarHeading>
    <NavbarDivider />
    <Button className={Classes.MINIMAL} icon="flash" text="Heater" />
    </NavbarGroup>
  </Navbar>
)

export default Header;
