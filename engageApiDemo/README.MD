# SAMPLE MIDDLWARE REST-API for Engage-Demo
## (C) 2019 - Heiko Voigt, Harbour Light Software Development Ltd.

## This component exposes a REST-interface on port 3000
## There are four methods:
* POST: /questionoftheday - returns a proton JSON object with the question(s) of the survey of the day, takes a {
    "username":username
}
* returns the question(s) of the day and whether the UserName has alreday taken the survey (first responseKey):
* POST: /response - takes a {
    "QuestionKey":"",
    "SurveyKey":"",
    "ResponseUserName":"",
    "ResponseStatus":"",
    "QuestionType":"",
    "ResponseContent":["","","",""],
    "ResponseComment":"",
    "ResponseAuthor":"",
    "ResponseTimeStamp":"",
    "ResponseKey":""
}
* Structure and returns a {"ResponsKey":"...."} or empty 
* GET: /listquestionsoftheday - returns a JSON Object with a list of all questions of the day.
* GET: /resultsforquestionkey/:questionkey - returns the summary results for a given QuestionKey 
