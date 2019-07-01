import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

// react-router-dom caused a problem when combined with react-bootstrap
// navigation <back> from the external web links failed
// there is another library that we did not implement that could help
// with this problem - illustrates that there is a library for pretty
// much anything, but that also can get you into trouble

class Navigation extends React.Component {
    componentDidMount() {
    }
    
    render() {
        return (
            <div>
                <Navbar collapseOnSelect bg="light" variant="light" expand="lg">
                    <Navbar.Brand href="/c3ug-qotd/index.html">
                        <img
                            src="c3ug_icon.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="C3UG logo"
                        />
                        {' Question of the Day'}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={NavLink} to="/qotd">Today's Question</Nav.Link>
                            <Nav.Link as={NavLink} to="/results">Results</Nav.Link>
                            <Nav.Link href="https://c3ug.ca">C3UG</Nav.Link>
                            <Nav.Link href="https://openntf.org">OpenNTF</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Navigation;