const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-access-token');
const router = express.Router();

dotenv.config();
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

router.get('/:channel/:role/:tokentype/:uid', (req, resp) => {
  nocache(req, resp);
  generateRTCToken(req, resp);
});

function nocache(_, resp) {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  //next();
}

function generateRTCToken(req, resp) {
  // set response header
  resp.header('Access-Control-Allow-Origin', '*');
  // get channel name
  const channelName = req.params.channel;
  if (!channelName) {
    return resp.status(400).json({ error: 'channel is required' });
  }
  // get uid
  let uid = req.params.uid;
  if (!uid || uid === '') {
    return resp.status(400).json({ error: 'uid is required' });
  }
  // get role
  let role;
  if (req.params.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  } else if (req.params.role === 'audience') {
    role = RtcRole.SUBSCRIBER;
  } else {
    return resp.status(400).json({ error: 'role is incorrect' });
  }
  // get the expire time
  let expireTime = req.query.expiry;
  if (!expireTime || expireTime === '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  // build the token
  let token;
  if (req.params.tokentype === 'userAccount') {
    token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  } else if (req.params.tokentype === 'uid') {
    token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  } else {
    return resp.status(400).json({ error: 'token type is invalid' });
  }
  // return the token
  return resp.json({ rtcToken: token });
}

module.exports = router;

