'use strict';
var _ = require("lodash");
var passport = require('passport');
var jwtpassport = require('passport');
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');
var ExtractJwt =passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var cors = require('cors');

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'c3ugcaisgreat';

var LdapStrategy = require('passport-ldapauth');
var basicAuth = require('basic-auth');
var expressValidator = require('express-validator');
const { check } = require('express-validator/check');

    
   var OPTS = {
    server: {
      url: 'your-url-to-your domino-ldap,
      bindDN: 'your bind dn',
      bindCredentials: 'your credentials',
      searchBase: 'your searchbase',
      searchFilter: '(uid={{username}})'
    },
    credentialsLookup: basicAuth
  };

  var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = {"id":jwt_payload.id};

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  

passport.use(new LdapStrategy(OPTS));

function validateQuestionKey(req, res, next) {
  req.check('questionkey',{'relatedParam': 'questionkey','technicalErrorMessage':'QuestionKey is invalid','userErrorMessage':'We have not been able to find any results for the requested Question.'}).isLength({min: 11});
  
 var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });
    res.statusCode = 400;
    return res.json(response);
  }
  return next();
 }

 function validateResponse(req, res, next) {
  req.checkBody('QuestionKey', 'Invalid Question Key').notEmpty();
  req.checkBody('SurveyKey', 'Invalid Survey Key').notEmpty();
  req.checkBody('ResponseUserName', 'Invalid ResponseUserName').notEmpty();
  req.checkBody('QuestionType', 'Invalid Question Type').notEmpty();
  req.checkBody('ResponseContent', 'Invalid ResponseContent').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var response = { errors: [] };
    errors.forEach(function(err) {
      response.errors.push(err.msg);
    });
    res.statusCode = 400;
    return res.json(response);
  }
  return next();
 }


module.exports = function(app) {
  
  var survey = require('../controllers/surveyController');
  
  jwtpassport.use(strategy);
  app.use(jwtpassport.initialize());
  app.use(passport.initialize());
  app.use(expressValidator());

  var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
 }
 app.use(cors(corsOptions));
 app.options('*', cors(corsOptions));

 
  
  app.get("/engageapi/login", passport.authenticate('ldapauth', { session: false }), survey.create_a_jwt_token );
  app.post('/engageapi/response',jwtpassport.authenticate('jwt', { session: false }),validateResponse,survey.create_a_response);
  app.get('/engageapi/secret', jwtpassport.authenticate('jwt', { session: false }), function(req, res){
    res.json({message: "Success! You can not see this without a token"});
  });
  app.post('/engageapi/questionoftheday',jwtpassport.authenticate('jwt', { session: false }),survey.read_question_of_the_day);
  app.get('/engageapi/listquestionsoftheday',jwtpassport.authenticate('jwt', { session: false }),survey.get_list_for_questions_of_the_day);
  app.get('/engageapi/resultsforquestionkey/:questionkey',jwtpassport.authenticate('jwt', { session: false }),validateQuestionKey,survey.get_results_for_question_of_the_day);

};