import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { fetchResult, fetchQuestions, login } from '../../actions';

class QotdList extends React.Component {
    componentDidMount() {
        this.props.fetchQuestions();
    }

    fetchResults(questionKey) {
        this.props.fetchResult(questionKey);
    }

    renderList() {
        return this.props.questions.map(question => {
            return (
                <div className="alert alert-secondary" key={question.QuestionKey}>
                    <div className="row">
                        <div className="col-sm-9">
                            {question.QuestionText}
                        </div>
                        <div className="col-sm-3" >
                            <button type="button" className="btn btn-primary" onClick={() => {
                               
                                this.fetchResults(question.QuestionKey);
                                }}
                            >View Results</button>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container">
                <h2>Previous Questions</h2>
                <div>{this.renderList()}</div>
            </div>
        );
    }
}

const formWrapped = reduxForm({
    form: 'surveyList'
})(QotdList);

const mapStateToProps = (state) => {
    return {
        questions: Object.values(state.questions),
        token: state.token
    }
};

export default connect(mapStateToProps, { fetchResult, fetchQuestions, login })(formWrapped);