import React from 'react';
import { Router, Route } from 'react-router-dom';
import QotdList from './qotd/QotdList';
import QotdLogin from './qotd/QotdLogin';
import QotdSurveyEdit from './qotd/QotdSurveyEdit';
import QotdSurveyDisplay from './qotd/QotdSurveyDisplay';
import Container from 'react-bootstrap/Container';          // you DO NOT need to use Bootstrap
import Row from 'react-bootstrap/Row';                      // but you need to use a UI library
import Col from 'react-bootstrap/Col';                      // I used Bootstrap because I knew 
import Navigation from './Navigation';                      // it from my XPages experience
import history from '../history';

const App = () => {
    return (
        <div>
            <Router history={history}>
                <div>
                    <Navigation />
                    <Container>
                        <Row>
                            
                            <Col xs={10}>
                                <Route path="/" exact component={QotdLogin} />
                                <Route path="/index.html" exact component={QotdLogin} />
                                <Route path="/qotd" exact component={QotdSurveyEdit} />
                                <Route path="/result/:id" exact component={QotdSurveyDisplay} />
                                <Route path="/results" exact component={QotdList} />
                            </Col>
                            
                        </Row>
                    </Container>
                </div>
            </Router>
        </div>
    );
};

export default App;