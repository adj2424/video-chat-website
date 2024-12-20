import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { getRoomById, getRtcToken } from '../service';

// import Grid from '@mui/material/Grid';

/*
Create Room page component
 */
const CreateRoom = props => {
  const [userName, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = React.useState(false);
  const socket = props.socket;
  const navigate = useNavigate();

  const joinRoom = async () => {
    let token = '';
    if (userName !== '' && roomId !== '') {
      try {
        token = await getRtcToken(roomId, userName);
        console.log('rtc token: ' + token);
        await getRoomById(roomId);
        // there was room so send error unable to create room
        await getRoomById(roomId);
        setError(true);
      } catch (error) {
        // there was no room with the id so create room
        console.log(`created room userName: ${userName}, roomId: ${roomId}`);
        createRoom(token);
      }
    }
  };

  const createRoom = async token => {
    await socket.emit('createRoom', roomId);
    navigate('/room/' + roomId, { state: { rtcToken: token, userName: userName } });
  };

  CreateRoom.propTypes = {
    socket: PropTypes.object
  };
  return (
    <div className="createContainer">
      <Collapse in={error}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          A room already exists with that ID
        </Alert>
      </Collapse>

      <Stack direction="row" justifyContent="center" alignItems="center">
        <Card sx={{ m: 10, textDecoration: 'none', bgcolor: '#141823' }}>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ m: 10 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 'bold' }} variant="h4" color="white" gutterBottom>
                Create room
              </Typography>
              <TextField
                sx={{ backgroundColor: '#FFF', m: 1, width: '25ch' }}
                id="outlined-basic"
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
                Create Room
              </Button>
            </CardActions>
          </Box>
        </Card>
      </Stack>
    </div>
  );
};
export default CreateRoom;
