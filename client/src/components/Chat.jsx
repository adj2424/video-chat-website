import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import '../css/components/ChatRoom.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getRoomById, clearMessages } from '../service';

export const ChatRoom = props => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const socket = props.socket;

  //async to wait for message to be sent
  const sendMessage = async () => {
    if (message !== '') {
      const msgData = {
        room: props.roomId,
        user: props.userName,
        message: message,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
      };
      console.log('sending', msgData);
      await socket.emit('sendMessage', msgData);
      //add message to message list
      setAllMessages(prev => [...prev, msgData]);
      //empties text box
      setMessage('');
    }
  };

  // remove previous messages in db and client
  const clearMessage = async () => {
    setAllMessages([]);
    await clearMessages(props.roomId);
  };
  // fetch persistent messages from db
  const fetchMsg = async room => {
    try {
      const res = await getRoomById(room);
      setAllMessages(res.messages);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    //listening for new messages
    socket.on('receivedMessage', msgData => {
      console.log('received message', msgData);
      setAllMessages(prev => [...prev, msgData]);
    });
    fetchMsg(props.roomId);
  }, [socket]);

  useEffect(() => {
    fetchMsg(props.roomId);
    // successfully joined room
  }, []);

  ChatRoom.propTypes = {
    socket: PropTypes.object,
    roomId: PropTypes.string,
    userName: PropTypes.string
  };

  return (
    <div className="chatContainer">
      <div className="body">
        <ScrollToBottom className="messageScrollContainer">
          <Stack direction="column" spacing={0.3}>
            {allMessages.map((message, index) => {
              if (message.user === props.userName) {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Chip
                      sx={{ fontSize: 16, p: 1, backgroundColor: '#0440CB', color: '#ffffff' }}
                      className="chip"
                      label={`${message.message}`}
                    />
                  </Box>
                );
              } else {
                if (index !== 0 && allMessages[index - 1].user === allMessages[index].user) {
                  return (
                    <div key={index}>
                      <Chip
                        sx={{ fontSize: 16, p: 1, backgroundColor: '#4d505a', color: '#ffffff' }}
                        variant="Filled"
                        label={`${message.message}`}
                      />
                    </div>
                  );
                }
                return (
                  <div key={index}>
                    <p className="messageHeader">{`${message.user} ${message.time}`}</p>
                    <Chip
                      sx={{ fontSize: 16, p: 2, backgroundColor: '#4d505a', color: '#ffffff' }}
                      variant="Filled"
                      label={`${message.message}`}
                    />
                  </div>
                );
              }
            })}
          </Stack>
        </ScrollToBottom>
      </div>
      <div className="footer">
        <TextField
          sx={{
            flexGrow: 1,
            input: {
              color: 'white'
            },
            '& .MuiInputLabel-root': {
              color: '#aeb0b5' // Label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#aeb0b5' // Focused label color
            }
          }}
          className="messageField"
          size="small"
          value={message}
          variant="filled"
          label="Send Message"
          onChange={e => {
            setMessage(e.target.value);
          }}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              sendMessage(message);
            }
          }}
        />
        <Button
          sx={{
            backgroundColor: '#0440CB',
            color: 'white'
          }}
          variant="contained"
          onClick={sendMessage}
          endIcon={<SendIcon />}
        ></Button>
      </div>
    </div>
  );
};
