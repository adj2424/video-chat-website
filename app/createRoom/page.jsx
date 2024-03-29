'use client';
import React from 'react';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { socket } from '../(utils)/socket';

/*
Create Room page component
 */
const CreateRoom = () => {
  const [userName, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = React.useState(false);
  const router = useRouter();

  const joinRoom = async () => {
    let token = '';
    if (userName !== '' && roomId !== '') {
      let url = `http://localhost:3000/api/rtc/${roomId}/publisher/uid/${userName}`;
      await fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
          token = data.rtcToken;
          console.log('rtc token: ' + token);
        });
      url = `http://localhost:3000/api/room/${roomId}`;
      console.log('url: ' + url);
      await fetch(url, { method: 'GET' })
        .then(response => response.json())
        // there was room so send error unable to create room
        .then(() => {
          setError(true);
          console.log('there was room so send error unable to create room');
        })
        // there was no room with the id so create room
        .catch(() => {
          console.log(`created room userName: ${userName}, roomId: ${roomId}`);
          createRoom(token);
        });
    }
  };

  const createRoom = rtcToken => {
    socket.emit('createRoom', roomId);
    router.push(`/room/${roomId}?userName=${userName}&rtcToken=${rtcToken}`);
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
