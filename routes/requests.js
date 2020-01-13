const express = require('express');
const router = express.Router();
const controller = require('../controller/requests');





//Send a friend request 
router.post('/sendfriendrequest/:requesteeid', controller.sendRequest);
router.get('/viewrequestsent', controller.viewRequestSent);
router.get('/viewrequestreceived', controller.viewRequestReceived);
router.patch('/acceptfriendrequest/:requestid', controller.acceptFriendRequest);
router.delete('/rejectfriendrequest/:requestid', controller.rejectFriendRequest);
router.delete('/cancelfriendrequest/:requestid', controller.cancelFriendRequest);

module.exports = router
