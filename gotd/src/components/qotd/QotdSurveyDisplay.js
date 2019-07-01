import React from 'react';
import { connect } from 'react-redux';
import { fetchQuestions, fetchResult } from '../../actions';
import { reduxForm } from 'redux-form';
import Card from 'react-bootstrap/Card';
import '../../css/qotd.css'
import ProgressBar from 'react-bootstrap/ProgressBar';

class QotdSurveyDisplay extends React.Component {

    componentWillMount() {
        const { id } = this.props.match.params;
        this.props.fetchResult(id);
    }

    generateResultGraph() {
        const striping = ["success", "info", "warning", "danger", "success", "info", "warning", "danger"];
        const answers = this.props.result;
        const results = answers.results;
        if (results === undefined) {
            return <div>Loading results...</div>;
        } else {
            return results.map((result, key) => {
                let lbl = result.choice + ' ' + result.value;

                return <div key={key} className="prgressOverride">
                    <ProgressBar className="progressOverride" striped label={lbl} variant={striping[key]} now={result.value} max={answers.total_responses}/>
                </div>
            });
        }
    }

    render() {
        
        const answers = this.props.result;
        let qTitle = answers.QustionText;
        let qDescr = answers.QuestionDescription;
        console.log("-->",answers);
        
        return (
            <div>
                <br />
                <Card>
                    <Card.Header as="h5">Question of the Day</Card.Header>
                    <Card.Body>
                        <Card.Title>{qTitle}</Card.Title>
                        <div>{qDescr}</div>
                        <br />
                        <div>
                            {this.generateResultGraph()}
                        </div>
                        <br />
                        <label>Total responses: {this.props.result.total_responses}</label>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

const formWrapped = reduxForm({
    form: 'surveyResult'
})(QotdSurveyDisplay);

const mapStateToProps = (state) => {
    return {
        qotd: state.qotd,
        questions: Object.values(state.questions),
        result: state.result,
        username: state.username.username
    }
};

export default connect(mapStateToProps, { fetchQuestions, fetchResult })(formWrapped);