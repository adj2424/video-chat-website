import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../css/pages/JoinRoom.css';
import { getAllRooms, getRoomById } from '../service';

/*
Join Room page component
 */
const JoinRoom = props => {
  const [userName, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const socket = props.socket;
  const navigate = useNavigate();

  let rtcToken = '';
  const [rooms, setRooms] = useState([]);

  const joinRoom = async roomID => {
    if (roomID !== '') {
      setRoomId(roomID);
    }

    if (userName !== '' && roomId !== '') {
      let url = `http://localhost:3001/rtc/${roomId}/audience/uid/${userName}`;
      await fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
          rtcToken = data.rtcToken;
          console.log('Token12: ' + rtcToken);
        });
      try {
        await getRoomById(roomId);
        // room exists so join room
        join(rtcToken);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      }
    }
  };

  const showRooms = async () => {
    const data = await getAllRooms();
    setRooms(data);
  };
  useEffect(() => {
    showRooms();
  }, []);

  // const joinRoomSpecific = (roomId) => {
  //   setRoomId(roomId);
  //   joinRoom()
  // }

  const join = async rtcToken => {
    await socket.emit('joinRoom', roomId);
    navigate('/room/' + roomId, { state: { rtcToken: rtcToken, userName: userName } });
  };

  JoinRoom.propTypes = {
    socket: PropTypes.object
  };
  return (
    <div className="joinContainer">
      <Collapse in={error}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrorMessage('There was no room with the id');
                setError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      </Collapse>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Card sx={{ m: 10, textDecoration: 'none', bgcolor: '#141823' }}>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ m: 10 }}>
            <CardContent>
              <Typography variant="h4" color="white" gutterBottom>
                Join room
              </Typography>
              <TextField
                required
                id="outlined-start-adornment"
                sx={{ backgroundColor: '#FFF', m: 1, width: '25ch' }}
                label="Name"
                variant="outlined"
                type="text"
                placeholder="name"
                onChange={e => {
                  setUsername(e.target.value);
                }}
              />
              <TextField
                sx={{ backgroundColor: '#FFF', m: 1, width: '25ch' }}
                id="outlined-basic"
                label="Room ID"
                variant="outlined"
                type="text"
                placeholder="room id"
                onChange={e => {
                  setRoomId(e.target.value);
                }}
              />
            </CardContent>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 10 }}>
            <CardActions>
              <Button
                sx={{ backgroundColor: 'white', fontWeight: 'bold' }}
                size="large"
                variant="outlined"
                onClick={joinRoom}
              >
                Join Room
              </Button>
            </CardActions>
          </Box>
          <ScrollToBottom className="messageScrollContainer">
            <Stack direction="column" spacing={0.3}>
              {rooms.map((room, index) => (
                <Button
                  sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between' }}
                  variant="outlined"
                  key={index}
                  className="rooms"
                  onClick={() => {
                    if (userName === '') {
                      setError(true);
                      setErrorMessage('User name is required');
                    }
                    joinRoom(room.id);
                  }}
                >
                  <div>{`${room.id}`}</div>
                  <div>{index}/6</div>
                </Button>
              ))}
            </Stack>
          </ScrollToBottom>
        </Card>
      </Stack>
    </div>
  );
};
export default JoinRoom;
