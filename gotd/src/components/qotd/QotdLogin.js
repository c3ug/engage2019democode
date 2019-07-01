import React from 'react';
import { connect } from 'react-redux';
import { login, signIn } from '../../actions';
import { reduxForm } from 'redux-form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class QotdLogin extends React.Component {
    state = { username: '', token: '' };
    componentDidMount() {
        this.props.login("home");
    }

    onFormSubmit = (event) => {
        event.preventDefault();
    }

    onButtonSubmit = (event) => {
        this.props.signIn(this.state.username);
    }

    render() {
        return (
            <div>
                <br />
                <Card>
                    <Card.Body>
                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Group>
                                <Form.Label>Enter your username:</Form.Label>
                                <Form.Control 
                                    placeholder="Enter username" 
                                    value={this.state.username}
                                    onChange={(e) => this.setState({ username: e.target.value})}
                                />
                                <Form.Label>* no registration required</Form.Label>
                            </Form.Group>
                            <Button 
                                variant="primary" 
                                type="submit"
                                onClick={this.onButtonSubmit}
                            >
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

const formWrapped = reduxForm({
    form: 'surveyLogin'
})(QotdLogin);

const mapStateToProps = (state) => {
    return { 
        username: state.username,
        qotd: state.qotd
    }
};

export default connect(mapStateToProps, { login, signIn })(formWrapped);