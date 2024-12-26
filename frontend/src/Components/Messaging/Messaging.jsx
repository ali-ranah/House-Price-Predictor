import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectToken } from '../State/Reducers/tokenSlice';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { Card } from '../ui/card';
import { Avatar, Spinner, Typography } from '@material-tailwind/react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { selectEmail } from '../State/Reducers/emailSlice';
import check from '../../assets/check.png';
import verify from '../../assets/verify.png';
import socket from '../Socket/Socket';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const userId = localStorage.getItem('userId');

  const token = useSelector(selectToken) || localStorage.getItem('token');
  const location = useLocation();
  const { propertyId,buyer,seller } = location.state || {};
  const userEmail = useSelector(selectEmail) || localStorage.getItem('email');

  useEffect(() => {
    if (!propertyId || !userEmail) return;

    // Emit the USER_CONNECTED event when the user connects
    socket.emit('USER_CONNECTED', { userEmail });

    // Fetch messages for the property
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

    // Listen for incoming messages
    socket.on('RECEIVE_MESSAGE', (message) => {
      console.log('Received message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
       // Mark the message as seen when it is received (if not already seen)
    if (message.receiverSeen === false) {
      socket.emit('MARK_AS_SEEN', { messageId: message._id, sender: message.sender,receiver: message.receiver});
    }
    });

   // Listen for the MESSAGE_SEEN event to update the message state
   socket.on('MESSAGE_SEEN', ({ messageId, senderEmail }) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId || msg.senderEmail === senderEmail
          ? { ...msg, receiverSeen: true }
          : msg
      )
    );
  });


    // Cleanup the socket connection and listeners on unmount
    return () => {
      socket.off('RECEIVE_MESSAGE');
      socket.off('MESSAGE_SEEN');

    };
  }, [propertyId, token, userEmail]);

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      if (!location.state || !buyer || !seller) {
        console.warn("Missing buyer or seller information in location state.");
        return; // Early return if missing data
      }
  
      const otherUserId = userId === buyer._id ? seller : buyer._id;
      try {
        const response = await AxiosRequest.get(`/api/get-receiver-info/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceiverInfo(response.data);
      } catch (error) {
        console.error("Error fetching receiver info:", error);
        // Consider more robust error handling here, e.g., display a message to the user
      }
    };
  
    fetchReceiverInfo();
  }, [location.state, userId, token]); // Add userId to the dependency array


  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    try {
      // Emit USER_CONNECTED event to check connection and fetch unseen message count
      socket.emit("USER_CONNECTED", { userEmail });

      // Now proceed with sending the message after checking the unseen count
      try {
        // Send the new message to the server
        const response = await AxiosRequest.post(
          `/api/messages/send`,
          { propertyId, message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Emit the new message to the receiver using socket
        socket.emit('SEND_MESSAGE', {
          receiverId: response.data.newMessage.receiver._id,
          message: response.data.newMessage,
        });

        // Update local state with the new message
        setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
        setNewMessage('');
      } catch (error) {
        toast.error('Failed to send message.');
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error in socket communication:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-6">
 <div className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b flex justify-center items-center">
  {receiverInfo && (
    <div className="flex items-center">
      <div>
        <Avatar
          variant="circular"
          size="sm"
          alt={receiverInfo.name || "User"}
          withBorder={true}
          color="blue-gray"
          src={receiverInfo.picture || "https://docs.material-tailwind.com/img/face-2.jpg"}
        />
      </div>
      <div className="flex flex-col ml-4"> {/* Added margin-left for spacing */}
        <Typography variant="h6" className="font-semibold text-gray-800">
          {receiverInfo.name}
        </Typography>
        <Typography variant="small" className="text-gray-600">
          {receiverInfo.email}
        </Typography>
      </div>
    </div>
  )}
</div>


      <div className="flex flex-col items-center justify-center font-poppins px-4 md:px-8 overflow-auto mb-20">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh] font-poppins">
            <Spinner color="blue" className="h-12 w-12" />
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
                      className={`relative w-full p-4 ${
                        msg.sender.email === userEmail
                          ? 'bg-blue-500 text-white rounded-br-none max-w-xs'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none max-w-xs'
                      }`}
                    >
                      <Typography className="text-sm">{msg.content}</Typography>

                      <div className={`absolute bottom-1 right-2 flex items-center gap-1`}>
                        <div className="text-xs">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
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
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh] bg-[#f8f9fa]">
                <Typography variant="paragraph" className="text-center py-4 text-gray-800 font-semibold">
                  No messages yet.
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={() => {
              handleSendMessage(newMessage);
              setNewMessage('');
            }}
            color="blue"
            className="w-20 py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
