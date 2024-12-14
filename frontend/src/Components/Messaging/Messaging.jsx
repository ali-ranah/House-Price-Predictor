import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectToken } from '../State/Reducers/tokenSlice';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { Card } from '../ui/card';
import { Spinner, Typography } from '@material-tailwind/react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { selectEmail } from '../State/Reducers/emailSlice';
import { FaCheck } from 'react-icons/fa';
import check from '../../assets/check.png';
import verify from '../../assets/verify.png';
import socket from '../Socket/Socket'; // Import socket logic

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);

  const token = useSelector(selectToken) || localStorage.getItem('token');
  const location = useLocation();
  const { propertyId } = location.state || {};
  const userEmail = useSelector(selectEmail) || localStorage.getItem('email');

  useEffect(() => {
    if (!propertyId) return;

    const fetchMessages = async () => {
      try {
        const response = await AxiosRequest.get(`/api/messages/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data.messages);
      } catch (error) {
        toast.error('Failed to fetch messages.');
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Socket setup for real-time updates
    socket.emit('USER_CONNECTED', { userEmail });

    socket.on('RECEIVE_MESSAGE', (message) => {
      console.log('Received message',message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('UNSEEN_MESSAGE_COUNT', ({ unseenCount }) => {
      console.log('Unseen message count',unseenCount);
      setUnseenCount(unseenCount);
    });

    return () => {
      socket.disconnect(); // Cleanup socket connection
    };
  }, [propertyId, token, userEmail, socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    try {
      const response = await AxiosRequest.post(
        `/api/messages/send`,
        { propertyId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      socket.emit('SEND_MESSAGE', {
        senderId: response.data.newMessage.sender._id,
        receiverId: response.data.newMessage.receiver._id,
        content: response.data.newMessage.content,
        propertyId,
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message.');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-6 pb-20">
      <Typography variant="h4" className="mb-4 text-center">Messaging</Typography>
      <div className="flex flex-col items-center justify-center font-poppins px-4 md:px-8 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen font-poppins">
            <Spinner color="white" className="h-12 w-12 text-black" />
          </div>
        ) : (
          <div className="w-full max-w-5xl mb-4 overflow-x-hidden overflow-y-auto">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender.email === userEmail ? 'justify-end' : 'justify-start'}`}
                  >
                    <Card
                      className={`relative w-full p-4 ${msg.sender.email === userEmail ? 'bg-blue-500 text-white rounded-br-none max-w-xs' : 'bg-gray-200 text-gray-800 rounded-bl-none max-w-xs'}`}
                    >
                      <Typography className="text-sm">{msg.content}</Typography>

                      {/* Show seen/unseen ticks */}
                      <div className={`absolute bottom-4 ${msg.sender.email === userEmail ? 'right-2' : 'right-2'}`}>
                        {msg.receiverSeen ? (
                          <div className="bg-white p-1 rounded-full">
                            <img
                              src={check}
                              alt="Seen"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-white p-1 rounded-full">
                            <img
                              src={verify}
                              alt="Sent"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Display timestamp */}
                      <div className={`absolute bottom-0 right-2 text-xs ${msg.sender.email === userEmail ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Typography>No messages yet.</Typography>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 flex items-center gap-4 border border-gray-300 bg-white p-2 rounded-md">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleSendMessage}
          color="blue"
          className="w-20 py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Messaging;
