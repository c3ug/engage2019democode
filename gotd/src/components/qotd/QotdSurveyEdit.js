import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { submitQotd } from '../../actions';
import history from '../../history';

class QotdSurveyEdit extends React.Component {
    componentDidMount() {
        // we need the user's login name before showing them the question
        if (this.props.username === undefined) {
            history.push("/");
        }
    }

    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <div>
                    <br />
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            )
        }
    }

    renderAnswer = ({ input, meta }) => {
        const choices = this.props.qotd.QuestionChoices;
        if (choices === undefined) {
            return <input type='radio' label='error'></input>;
        } else {
            return choices.map((value, key) => {
                let inputId='questionResponse' + key;
                return (
                    <div key={key}>
                        <input name="answer" type="radio" {...input} key={key} id={inputId} value={value} autoComplete="off" />
                        <label htmlFor={inputId}>&nbsp;{value}</label>
                    </div>
                );
            });
        }
    }

    onSubmit = (formValues) => {
        const submitTime = new Date().toLocaleString();
        const submitData = {
            'QuestionKey': this.props.qotd.QuestionKey, 
            'QuestionType': this.props.qotd.QuestionType, 
            'ResponseAuthor': 'Heiko Voigt/Harbour-Light/CA',                   // yes, this shouldn't be hard coded
            'ResponseComment': 'These extra fields are for future flexibility',
            'ResponseContent': formValues.answer.split(','),
            'ResponseKey': '',
            'ReponseStatus': '',
            'ResponseTimeStamp': submitTime,
            'ResponseUserName': this.props.username, 
            'SurveyKey': this.props.qotd.SurveyKey
        };
        this.props.submitQotd(submitData, this.props.qotd.QuestionKey);
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <br />
                <div className="alert alert-dark">
                    <h3>Welcome {this.props.username}</h3>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h4>Question of the Day</h4>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.qotd.QuestionText}</h5>
                        <p className="card-text">{this.props.qotd.QuestionDescription}</p>
                        <Field name="answer" component={this.renderAnswer} />
                    </div>
                    <div className="card-footer">
                        <div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
                
            </form>
        );
    }
}

const validate = (formValues) => {
    const errors = {};

    if (!formValues.answer) {
        errors.answer = 'Please provide an answer before tapping Submit';
    }

    return errors;
};

const formWrapped = reduxForm({
    form: 'surveyEdit',
    validate
})(QotdSurveyEdit);

const mapStateToProps = (state) => {
    return {
        qotd: state.qotd,
        username: state.username.username
    }
};

export default connect(mapStateToProps, { submitQotd })(formWrapped);