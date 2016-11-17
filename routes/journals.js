let express = require('express'),
    logAnswers = require('../models/log_answers'),
    logEntryCall = require('../models/log_calls'),
//    load_user = require('../middleware/load_user'),
//    load_menu = require('../middleware/load_menu'),
//    load_rooms = require('../middleware/load_rooms'),
    settingServer = require('../models/settings');
    EntryConnect = require('../models/log_connect'),
    missedCalls = require('../models/missed_calls'),
    logFailedTokenize = require('../models/failed_tokenize'),
    router = express.Router(),
    utils = require('../utils');


/* GET root journals */
router.get('/', (req, res) => {
    res.json({
        "status": "none",
        "message": "Welcome to the journal API"
        });
});

/* GET root journals */
router.get('/wgt', (req, res) => {
    settingServer.findOne({
            name: 'displayWidgets'
        }, (errSet, result) => {
                if (errSet) {
                    res.json({
                            "status": "fail",
                            "message": errSet
                        });
                } else {
                    res.json(result);
                }
            });
});

// Adding missed calls
router.get('/missed-calls', (req, res) => {
    res.json({
        "status": "none",
        "message": "API to add missed calls"
    });    
});
router.get('/missed-calls/add', (req, res) => {
    res.json({
        "status": "none",
        "message": "API to add missed calls"
    });
});
router.post('/missed-calls/add', (req, res) => {
    if (Object.keys(req.body).length !== 0) {
        let tmpEntry = missedCalls({
                userInfo: req.body.userInfo,
                date: Date.now(),
                easyRtcToken: req.body.easyRtcToken
            });
        tmpEntry.save(function(err) {
                if (err) {
                    utils.appLogger('fail', 'Fail adding document(missed_calls)', `Fail, when app try adding document with type MISSED_CALLS(${req.body}). Error message: ${err}`);
                    res.json({
                            "status": "fail",
                            "message": "Can not save in database"
                        });
                } else {
                    utils.appLogger('success', 'Success adding document(missed_calls)', `Success adding document with type MISSED_CALLS(${req.body}).`);
                    res.json({
                            "status": "success",
                            "message": "Object added"
                        });
                }
            });
    } else {
        utils.appLogger('failed', 'Failed adding document(missed_calls)', `Failed adding document with type MISSED_CALLS(${req.body}).`);
        res.json({
            "status": "fail",
            "message": "Object added"
        });
    }
});


// Adding failed tokenize
router.get('/failed-tokenize/', (req, res) => {
    res.json({  
        "status": "none",
        "message": "API to work with error tokenize"
    });       
});
router.get('/failed-tokenize/add', (req, res) => {
    res.json({  
        "status": "none",
        "message": "API to add error tokenize"
    });
});
router.post('/failed-tokenize/add', (req, res) => {
    if (Object.keys(req.body) !== 0) {
        let tmpEntry = logFailedTokenize({
                userInfo: req.body.userInfo,
                date: Date.now(),
                userAgent: req.body.userAgent,
                error: req.body.error
            });
        tmpEntry.save(function(err) {
                if (err) {
                    utils.appLogger('fail', 'Fail save document (failed_tokenize)', `Fail, when app try save document type FAILED_TOKENIZE. Error message: ${err}.`);
                    res.json({
                        "success": "false",
                        "message": 'Fail find token'
                    });
                } else {
                    utils.appLogger('success', 'Success adding document(failed_tokenize)', `Success adding document with type FAILED_TOKENIZE(${req.body}).`);
                    res.json({
                            "status": "success",
                            "message": "Object added"
                        });
                }
            });
    } else {
        utils.appLogger('failed', 'Failed adding document(failed_tokenize)', `Failed adding document with type FAILED_TOKENIZE(${req.body}).`);
        res.json({
            "status": "fail",
            "message": "Object added"
        });
    }
});

// Get user information
router.get('/userentry/:rtc_token', (req, res) => {
    EntryConnect.findOne({
            easyRtcToken: req.params.rtc_token
        }, (err, entry) => {
            if(err) {
                utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type lOG_CONNECT with token- ${req.body.easyRtcToken}. Error message: ${err}.`);
                res.json({
                        "success": "false",
                        "message": 'Fail find token'
                    });
            } else {
                res.json(entry);
            }
        });    
});
/* Connection journal */
router.get('/connections/', (req, res) => {
    res.json({
            "status": "none",
            "message": "Welcome to connection API"
        });    
});
/* Connection add */
router.get('/connections/add', (req, res) => {
    res.json({
            "status": "none",
            "message": "Add entry to connection entry" 
        });    
});
router.post('/connections/add', (req, res) => {
    if(Object.keys(req.body).length !== 0) {
        let tmpEntry = EntryConnect({
                clientInfo: req.body.clientInfo,
                username: req.body.username, 
                userfio: req.body.userfio, 
                city: req.body.city,
                easyRtcToken: req.body.easyRtcToken,
                date: Date.now()
            });
        tmpEntry.save((err) => {
                if(err) {
                    utils.appLogger('fail', 'Fail adding document(log_connect)', `Fail, when app try adding document with type LOG_CONNECT(${req.body}). Error message: ${err}`);
                    res.json({
                            "status": "fail",
                            "message": "Can not save in database"
                        });
                } else {
                    utils.appLogger('success', 'Success adding document(log_connect)', `Success adding document with type LOG_CONNECT(${req.body}).`);
                    res.json({
                            "status": "success",
                            "message": "Object added"
                        });
                }
            });
    } else {
        utils.appLogger('failed', 'Failed adding document(log_connect)', `Failed adding document with type LOG_CONNECT(${req.body}).`);
        res.json({
            "status": "fail",
            "message": "Object added"
        });
    }
});
/* Work with answers */
router.get('/answers/', (req, res) => {
    res.json({
            "status": "none",
            "message": "API to work journals of answers"
        });    
});
router.get('/answers/add', (req, res) => {
    res.json({
            "status": "none",
            "message": "API to add answers to journal of answer"
    });    
});
router.post('/answers/add', (req, res) => {
    if(Object.keys(req.body).length !== 0) {
        let tmpEntry = logAnswers({
                pollsType: req.body.pollsType,
                date: Date.now(),
                answersToPolls: req.body.answersToPolls,
                employeeRtcToken: req.body.employeeRtcToken,
                custometRtcToken: req.body.custometRtcToken,
                comments: req.body.comments
            });
        tmpEntry.save((err) => {
                if(err) {
                    utils.appLogger('fail', 'Fail adding document(log_answers)', `Fail, when app try adding document with type LOG_ANSWERS(${req.body}). Error message: ${err}`);
                    res.json({
                            "status": "fail",
                            "message": "Can not save in database"
                        });
                } else {
                    utils.appLogger('success', 'Success adding document(log_answers)', `Success adding document with type LOG_ANSWERS(${req.body}).`);
                    res.json({
                            "status": "success",
                            "message": "Object added"
                        });
                }
            });
    } else {
        utils.appLogger('fail', 'Fail adding document(log_answers)', `Fail, when app try adding document with type LOG_ANSWERS(${req.body}).`);
        res.json({
                "status": "fail",
                "message": "Object not full"
            });
    }
});
/* Calls */
router.get('/calls/', (req, res) => {
    res.json({
            "status": "none",
            "message": "API to work with journal calls"
        });
});


router.get('/calls/add', (req, res) => {
    res.json({
        "status":"none",
        "message": "API to adding entry to journal calls"
    });    
});


router.post('/calls/add', (req, res) => {
    if(Object.keys(req.body).length  !== 0) {
        let tmpEntry = logEntryCall({
                callStart: req.body.callStart,
                callEnd: req.body.callEnd,
                employeeToken: req.body.employeeToken,
                customerToken: req.body.customerToken
            });
        tmpEntry.save((err) => {
            console.log(err);
                if(err) {
                    utils.appLogger('fail', 'Fail adding document(log_calls)', `Fail, when app try adding document with type LOG_CALLS(${req.body}). Error message: ${err}`);
                    res.json({
                            "status": "fail",
                            "message": "Can not save in database"
                        });
                } else {
                    utils.appLogger('success', 'Success adding document(log_calls)', `Success adding document with type LOG_CALLS(${req.body}).`);
                    res.json({
                            "status": "success",
                            "message": "Object added"
                        });
                }
            });
    } else {
        utils.appLogger('fail', 'Fail adding document(log_calls)', `Fail, when app try adding document with type LOG_CALLS(${req.body}).`);
        res.json({
                "status": "fail",
                "message": "Object not full"
            });
    }
});
module.exports = router;
