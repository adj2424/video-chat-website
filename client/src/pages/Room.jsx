import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { ChatRoom } from '../components/Chat';
import { useLocation } from 'react-router-dom';
import Video from '../components/Video';
import '../css/pages/PublicChat.css';

export const Room = props => {
  const { id } = useParams();
  const { state } = useLocation();
  const { rtcToken, userName } = state;

  Room.propTypes = {
    socket: PropTypes.object,
    userName: PropTypes.string
  };
  return (
    <div className="public-chat">
      <div className="one">
        {/* <Video socket={props.socket} userName={userName} roomId={String(id)} rtcToken={rtcToken} /> */}
      </div>
      <ChatRoom socket={props.socket} userName={userName} roomId={String(id)} />
    </div>
  );
};
