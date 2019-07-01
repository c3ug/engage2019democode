'use strict';

const {useServer} = require('@domino/domino-db');
const serverConfig = require('../../config/server-config');
var _ = require('lodash');
var io = require('socket.io-client');


var socket = io.connect('url-to-socket-io-server', {reconnect:true});
socket.on('connect',function(socket) {
  console.info("connected to Socket server !");
});

var jwtpassport = require('passport');
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');
var ExtractJwt =passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'c3ugcaisgreat';

const databaseConfig = {
  filePath: 'q.nsf',  // The database file name
};


function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
      S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() +
      S4());
}

function mergeById(arr) {
  return {
    with: function(arr2) {
      return _.map(
          arr, item => {return _.find(arr2, obj => obj.id === item.id) || item})
    }
  }
}

exports.create_a_response = function(req, res) {
  //console.info('Request body: ' + JSON.stringify(req.body));
  const body = req.body;
  

  useServer(serverConfig)
      .then(async dominoserver => {
        const responseKey = guidGenerator();
        const database = await dominoserver.useDatabase(databaseConfig);
        const unid = await database.createDocument({
          document: {
            Form: 'Response',

            QuestionKey: body.QuestionKey,
            SurveyKey: body.SurveyKey,
            ResponseUserName: body.ResponseUserName,
            ResponseStatus: '',
            QuestionType: body.QuestionType,
            ResponseContent: body.ResponseContent,
            ResponseComment: body.ResponseComment,
            ResponseAuthor: body.ResponseAuthor,
            // ResponseTimeStamp:response.ResponseTimeStamp,
            ResponseKey: responseKey,

          },
        });
        socket.emit('APICall',socket.id.slice(8),'response');
        res.status(200);
        res.json({'ResponseKey': responseKey});
      })
      .catch(error => {
        // server configuration is malformed
        console.log(error);
        res.status(500);
        res.send(error);
      });
  
};

exports.create_a_jwt_token = function(req,res) {
  
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: req.body.name};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
    socket.emit('APICall',socket.id.slice(8),'login');
  
}

exports.read_question_of_the_day = function(req, res) {
  var back = new Object();
  const body = req.body;
  console.info(body);
  useServer(serverConfig)
      .then(async server => {
        const database = await server.useDatabase(databaseConfig);
        const collection = await database.bulkReadDocuments({
          query:
              'SurveyStatus = \'1\' and Form = \'QDesignQuestion\' and SurveyOfTheDay = \'1\'',
          itemNames: [
            'QuestionText', 'QuestionDescription', 'QuestionType',
            'QuestionChoices', 'QuestionKey', 'SurveyKey', 'QuestionSeqNo'
          ],


        });
        var question_attributes = collection.documents;
        var user_name = body.UserName;
        var question_key = collection.documents[0].QuestionKey;
        var responseKey = await lookupForResponses(user_name,question_key);
        back = ({'documents':question_attributes,'response_key':responseKey});

        socket.emit('APICall',socket.id.slice(8),'readqotd');
        res.status(200);
        res.json(back);
        
        
      })
      .catch(error => {
        // server configuration is malformed
        console.log(error);
        res.status(500);
        res.send(error);
      });
      
};

function lookupForResponses(user_name, question_key) {
 return useServer(serverConfig)
      .then(async server => {
        const database = await server.useDatabase(databaseConfig);
        const collection = await database.bulkReadDocuments({
          query:
              'Form = \'Response\' and QuestionKey = \''+question_key+'\' and ResponseUserName = \''+user_name+'\'',
          itemNames: [
            'ResponseKey',
          ],


        });
        var back = "";
        console.info(user_name);
        if(collection.documentRange.total>0) {
          back = collection.documents[0].ResponseKey;
    
          if(back==undefined) {
            back = "";
          } 
          
        } else {
          back ="";
        }
        console.info(back);
        return back;
        
      })
      .catch(error => {
        // server configuration is malformed
        console.log(error);
        return(error);
      });
}

exports.get_results_for_question_of_the_day = function(req, res) {
  const question_key = req.params.questionkey;
  useServer(serverConfig)
      .then(async server => {
        const database = await server.useDatabase(databaseConfig);
        const list = await database.bulkReadDocuments({
          query: 'Form = \'Response\' and QuestionKey = \'' + question_key + '\'',
          itemNames: ['ResponseContent'],

        });
        const question_list = await database.bulkReadDocuments({
          query:
              'Form = \'QDesignQuestion\' and QuestionKey = \'' + question_key + '\'',
          itemNames: [
            'QuestionText', 'QuestionDescription', 'QuestionType',
            'QuestionChoices', 'QuestionKey', 'SurveyKey', 'QuestionSeqNo'
          ],


        });
        var results = new Array();
        var question_choices = question_list.documents[0].QuestionChoices;
        var question_text = question_list.documents[0].QuestionText;
        var question_description = question_list.documents[0].QuestionDescription;

        // Now, we have to map through the choices and Init our choices objects using tite and 0.

        for (var t =0; t<question_choices.length; t++) {
          const key_choice = question_choices[t];
          var object_new = {'choice': key_choice, 'value': 0};
          results.push(object_new);
        }

        // now, we want to act on the documents...
        var back = new Object();
        

        for (var i = 0; i < list.documentRange.total; i++) {

          var choices = list.documents[i].ResponseContent;

          for (var o = 0; o < choices.length; o++) {
            var key = choices[o].toString();


            let obj = results.find(o => o.choice === key);

            if (obj != undefined) {  // if we already have this choice in the
                                     // results set
              var v = obj.value;

              v = v + 1;
              var replacement_object = {'choice': key, 'value': v};

              var repl = new Array();
              repl.push(replacement_object);

              // Value replacement in an array using lodash
              results =
                  _(results).differenceBy(repl, 'choice').concat(repl).value();

            } else {  // if not, let's just push it into the array
              var object_new = {'choice': key, 'value': 1};
              results.push(object_new);
            }
          }

          // Now, we create the object that get's returned to the client....
          var back = ({'QuestionKey': question_key,"QuestionText":question_text, "QuestionDescription":question_description, 'results': results,'total_responses':list.documentRange.total});
          
          }
          socket.emit('APICall',socket.id.slice(8),'results');
          res.status(200);
        res.json(back);
      })
      .catch(error => {
        // server configuration is malformed
        console.log(error);
        res.status(500);
        res.send(error);
      });
};

exports.get_list_for_questions_of_the_day = function(req, res) {
  // var descendingOrder = _.sortBy( homes, 'price' ).reverse();
  // var ascendingOrder = _.sortBy( homes, 'price' );
  //
  useServer(serverConfig)
      .then(async server => {
        const database = await server.useDatabase(databaseConfig);
        const documents = await database.bulkReadDocuments({
          query: 'Form = \'QDesignQuestion\' and SurveyOfTheDay = \'1\'',
          itemNames: [
            'QuestionText', 'QuestionDescription', 'QuestionType',
            'QuestionChoices', 'QuestionKey', 'SurveyKey', 'SurveyStartDate',
            'QuestionSeqNo'
          ],


        });

        res.status(200);
        res.json(documents);
        socket.emit('APICall',socket.id.slice(8),'questionlist');
      })
      .catch(error => {
        // server configuration is malformed
        console.log(error);
        res.status(500);
        res.send(error);
      });
};