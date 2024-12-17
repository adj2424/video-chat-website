import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getRoomById, getRtcToken, ping } from '../service';

const ComplexGrid = props => {
  const socket = props.socket;

  let rtcToken = '';
  const joinRoom = async () => {
    const roomId = 'public';
    let currentDate = new Date();
    const userName = 'user' + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds();
    try {
      rtcToken = await getRtcToken(roomId, userName);
      console.log('rtc token: ' + rtcToken);
      await getRoomById(roomId);
      await getRoomById(roomId);
      console.log(`joined room userName: ${userName}, roomId: ${roomId}`);
      join(rtcToken, roomId, userName);
    } catch (error) {
      console.log(error.message);
    }
  };

  const join = async (rtcToken, roomId, userName) => {
    await socket.emit('joinRoom', roomId);
    navigate('/room/' + roomId, { state: { rtcToken: rtcToken, userName: userName } });
  };
  ComplexGrid.propTypes = {
    socket: PropTypes.object
  };
  const navigate = useNavigate();

  const test = async () => {
    const res = await ping();
    console.log(res);
  };

  useEffect(() => {
    test();
  }, []);

  return (
    <Stack sx={{ m: 10 }} direction="row" spacing={10} justifyContent="center" alignItems="center" className="cards">
      <Card sx={{ bgcolor: '#232632', height: 400, width: 400 }}>
        <Box display="flex" justifyContent="center" sx={{ mx: 5, mt: 5, overflow: 'visible', height: 230 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }} variant="h4" color="white" gutterBottom>
              Create a Room
            </Typography>
            <Typography variant="body2" color="white" gutterBottom>
              Allows users to create their own room
            </Typography>
            <Typography variant="body2" color="white">
              Share your ID for others to join
            </Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyContent="center" sx={{ mb: 5, alignItems: 'flex-end' }}>
          <CardActions>
            <Button
              sx={{ backgroundColor: '#0440CB', fontWeight: 'bold', color: 'white', width: 200 }}
              size="large"
              variant="outlined"
              onClick={() => navigate('/createRoom')}
            >
              Create
            </Button>
          </CardActions>
        </Box>
      </Card>
      <Card sx={{ bgcolor: '#232632', height: 400, width: 400 }}>
        <Box display="flex" justifyContent="center" sx={{ mx: 5, mt: 5, overflow: 'visible', height: 230 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }} variant="h4" color="white" gutterBottom>
              Join a Room
            </Typography>
            <Typography variant="body2" color="white" gutterBottom>
              Allows users to join other users room
            </Typography>
            <Typography variant="body2" color="white">
              Join others by entering room ID
            </Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyContent="center">
          <CardActions>
            <Button
              sx={{ backgroundColor: '#0440CB', fontWeight: 'bold', color: 'white', width: 200 }}
              size="large"
              variant="outlined"
              onClick={() => navigate('/joinRoom')}
            >
              Join
            </Button>
          </CardActions>
        </Box>
      </Card>
      <Card sx={{ bgcolor: '#232632', height: 400, width: 400 }}>
        <Box display="flex" justifyContent="center" sx={{ mx: 5, mt: 5, overflow: 'visible', height: 230 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }} variant="h4" color="white" gutterBottom>
              Public Chat
            </Typography>
            <Typography variant="body2" color="white" gutterBottom>
              Allows users to chat with anyone
            </Typography>
            <Typography variant="body2" color="white">
              Anyone can join!
            </Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyContent="center" sx={{ mb: 5, alignItems: 'flex-end' }}>
          <CardActions>
            <Button
              sx={{ backgroundColor: '#0440CB', fontWeight: 'bold', color: 'white', width: 200 }}
              size="large"
              variant="outlined"
              onClick={joinRoom}
            >
              Explore
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Stack>
  );
};
export default ComplexGrid;
