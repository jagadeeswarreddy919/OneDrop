import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { socket } from '../utils/socket';
import { MessageSquare, Send, Smile, Paperclip, CheckCheck, Loader2, ArrowLeft, Activity, Heart, Gift, Bell, MapPin, FileText, X, Download, Home } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';

const ChatWorkspace = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingStatus, setTypingStatus] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState({});

  // New features state
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user?._id) return;

    // Register session
    socket.emit('register', user._id);

    // Socket events
    socket.on('new_message', (message) => {
      if (activeChat && message.chat.toString() === activeChat._id.toString()) {
        setMessages((prev) => [...prev, message]);
      }
      // Refresh chat summaries
      fetchChats();
    });

    socket.on('typing', ({ chatId, userId }) => {
      if (activeChat && chatId === activeChat._id && userId !== user._id) {
        setOtherUserTyping(true);
      }
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      if (activeChat && chatId === activeChat._id && userId !== user._id) {
        setOtherUserTyping(false);
      }
    });

    socket.on('user_status', ({ userId, status }) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [userId]: status === 'online'
      }));
    });

    socket.on('chat_notification', () => {
      fetchChats();
    });

    return () => {
      socket.off('new_message');
      socket.off('typing');
      socket.off('stop_typing');
      socket.off('user_status');
      socket.off('chat_notification');
    };
  }, [activeChat, user]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  const openedFromNotifRef = useRef(false);

  useEffect(() => {
    const openChatFromNotification = async () => {
      if (openedFromNotifRef.current || !token) return;
      const partnerId = searchParams.get('partnerId');
      const chatId = searchParams.get('chatId');
      if (!partnerId && !chatId) return;

      openedFromNotifRef.current = true;

      if (chatId) {
        try {
          const listRes = await axios.get(`${API_URL}/api/chats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const existing = listRes.data.find((c) => c._id === chatId);
          if (existing) {
            setChats(listRes.data);
            setActiveChat(existing);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (partnerId) {
        try {
          const res = await axios.post(
            `${API_URL}/api/chats`,
            { recipientId: partnerId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setActiveChat(res.data);
          await fetchChats();
        } catch (err) {
          console.error('Failed to open chat from notification', err);
        }
      }
    };

    openChatFromNotification();
  }, [searchParams, token]);

  // Fetch messages when chat room switches
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chats/${activeChat._id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        
        // Let sockets know we joined this room
        socket.emit('join_chat', activeChat._id);
        setOtherUserTyping(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat, token]);

  // Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachment(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview('');
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    setUploading(true);

    try {
      let res;
      if (attachment) {
        const formData = new FormData();
        formData.append('text', inputText);
        formData.append('file', attachment);

        res = await axios.post(
          `${API_URL}/api/chats/${activeChat._id}/messages`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        res = await axios.post(
          `${API_URL}/api/chats/${activeChat._id}/messages`,
          { text: inputText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Instantly push to UI
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
      handleRemoveAttachment();

      // Stop typing
      socket.emit('stop_typing', { chatId: activeChat._id, userId: user._id });
      setTypingStatus(false);

      // Relay via Socket IO to recipients
      socket.emit('send_message', res.data);
      fetchChats();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const locationMessage = `📍 Shared Coordinates Location:\n${mapLink}`;
        
        try {
          const res = await axios.post(
            `${API_URL}/api/chats/${activeChat._id}/messages`,
            { text: locationMessage },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages((prev) => [...prev, res.data]);
          socket.emit('send_message', res.data);
          fetchChats();
        } catch (err) {
          console.error("Failed to share location coordinates", err);
        }
      },
      (error) => {
        alert(`Failed to retrieve location: ${error.message}`);
      }
    );
  };

  const QUICK_PHRASES = [
    "I'm on my way! 🚗",
    "Which room / block number? 🏥",
    "I have arrived at the blood bank.",
    "Please give me a call when you are free.",
    "I have successfully pledged! 🩸",
    "Thank you so much! ❤️"
  ];

  const QUICK_EMOJIS = ['❤️', '👍', '🙏', '🩸', '🚨', '🏥', '😊'];

  const handleTyping = (e) => {
    setInputText(e.target.value);
    
    if (!typingStatus && activeChat) {
      setTypingStatus(true);
      socket.emit('typing', { chatId: activeChat._id, userId: user._id });
    }

    // Reset typing status after delay of inactivity
    const timeout = setTimeout(() => {
      if (typingStatus && activeChat) {
        socket.emit('stop_typing', { chatId: activeChat._id, userId: user._id });
        setTypingStatus(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/chats/message/${messageId}/reaction`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update specific message in state
      setMessages((prev) => prev.map((m) => m._id === messageId ? res.data : m));
    } catch (err) {
      console.error(err);
    }
  };

  const getRecipientUser = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  const getDashboardLink = (tab = '') => {
    if (!user) return '/';
    let basePath = '/';
    switch (user.role) {
      case 'Super Admin':
      case 'Admin': basePath = '/admin'; break;
      case 'Donor': basePath = '/donor'; break;
      case 'Recipient': basePath = '/recipient'; break;
      case 'Hospital': basePath = '/hospital'; break;
      default: basePath = '/';
    }
    return tab ? `${basePath}?tab=${tab}` : basePath;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[80vh] flex flex-col md:flex-row gap-6 pb-24 md:pb-8">
      
      {/* Sidebar chats list */}
      <div className={`w-full md:w-80 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg flex flex-col overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">Conversations</h3>
        </div>

        <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const recipient = getRecipientUser(chat);
              const isActive = activeChat?._id === chat._id;
              const isOnline = onlineStatus[recipient?._id] || false;

              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 cursor-pointer transition-all flex gap-3 items-center ${
                    isActive 
                      ? 'bg-primary-50/50 dark:bg-primary-950/20 border-l-4 border-primary-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-dark-800/40'
                  }`}
                >
                  <div className="relative">
                    {recipient?.profileImage ? (
                      <img src={recipient.profileImage} alt={recipient.fullName} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {recipient?.fullName.charAt(0)}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-dark-900 ${
                      isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`} />
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-xs truncate">{recipient?.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{chat.lastMessage?.text || 'Start conversation...'}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No active conversations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main chat window container */}
      <div className={`flex-grow bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg flex flex-col overflow-hidden ${activeChat ? 'flex' : 'hidden md:flex'}`}>
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-dark-800/40">
              <div className="flex items-center">
                {/* Back button for mobile */}
                <button 
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="mr-3 p-1.5 hover:bg-slate-200 dark:hover:bg-dark-850 rounded-full md:hidden text-slate-500 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="font-bold text-sm">{getRecipientUser(activeChat)?.fullName}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold">{otherUserTyping ? 'typing...' : 'active now'}</p>
                </div>
              </div>
            </div>

            {/* Chat message list */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-dark-950/20">
              {messages.map((msg) => {
                const isMine = msg.sender?._id === user._id || msg.sender === user._id;

                return (
                  <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className="space-y-1 max-w-sm">
                      <div className={`p-3 rounded-2xl relative group ${
                        isMine 
                          ? 'bg-primary-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-dark-800 border dark:border-dark-700 rounded-tl-none'
                      }`}>
                        {msg.text && <p className="text-xs whitespace-pre-wrap">{msg.text}</p>}
                        
                        {/* Render Attachments */}
                        {msg.fileUrl && msg.fileType === 'image' && (
                          <img 
                            src={`${API_URL}${msg.fileUrl}`} 
                            alt="Chat Attachment" 
                            className="max-w-[200px] sm:max-w-[240px] max-h-[200px] object-cover rounded-xl mt-1.5 cursor-pointer border border-black/10 hover:opacity-95 transition-opacity" 
                            onClick={() => setPreviewImage(`${API_URL}${msg.fileUrl}`)}
                          />
                        )}
                        {msg.fileUrl && msg.fileType !== 'image' && msg.fileType !== 'none' && (
                          <div className={`flex items-center gap-2 mt-2 p-2 rounded-xl border ${
                            isMine 
                              ? 'bg-primary-700/50 border-primary-500' 
                              : 'bg-slate-50 dark:bg-dark-855 border-slate-200 dark:border-slate-750'
                          }`}>
                            <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                            <div className="min-w-0 flex-grow text-[10px]">
                              <p className="font-bold truncate">{msg.fileUrl.split('/').pop().replace(/^\d+-/, '')}</p>
                              <span className="text-[8px] text-slate-400">Document</span>
                            </div>
                            <a
                              href={`${API_URL}${msg.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className={`p-1.5 rounded-lg transition-colors ${
                                isMine 
                                  ? 'hover:bg-primary-600/50 text-white' 
                                  : 'hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                        
                        {/* Read Receipts */}
                        {isMine && (
                          <div className="flex justify-end mt-1 text-[8px] text-primary-200">
                            <CheckCheck className="w-3 h-3" />
                          </div>
                        )}

                        {/* Reaction bar popover */}
                        <div className="absolute hidden group-hover:flex -top-8 right-0 bg-white dark:bg-dark-800 shadow-md border rounded-full px-2 py-0.5 gap-1.5 z-10">
                          {['❤️', '👍', '🙏'].map(e => (
                            <span 
                              key={e} 
                              onClick={() => addReaction(msg._id, e)} 
                              className="cursor-pointer hover:scale-125 transition-transform text-xs"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Displayed message reactions */}
                      {msg.reactions?.length > 0 && (
                        <div className="flex gap-1">
                          {msg.reactions.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-dark-800 border rounded-full text-[9px]">
                              {r.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator bubble */}
              {otherUserTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="bg-white dark:bg-dark-800 border dark:border-dark-750 p-3 rounded-2xl rounded-tl-none max-w-max flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>

            {/* Quick Phrases selection list */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-dark-800/40 border-t flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
              {QUICK_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText((prev) => prev ? `${prev} ${phrase}` : phrase)}
                  className="px-3 py-1.5 bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-750 transition-colors shrink-0"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* Typing input selector */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex flex-col gap-3 bg-white dark:bg-dark-900">
              
              {/* Attachment Preview UI */}
              {attachment && (
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-dark-800 p-2 rounded-xl border dark:border-dark-750 max-w-max">
                  {attachmentPreview ? (
                    <img src={attachmentPreview} alt="Attachment preview" className="w-12 h-12 object-cover rounded-lg border" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-dark-700 rounded-lg border">
                      <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                  <div className="min-w-0 max-w-[150px]">
                    <p className="text-[10px] font-bold truncate">{attachment.name}</p>
                    <p className="text-[8px] text-slate-400">{(attachment.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-dark-750 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition-all"
                  title="Attach File"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleShareLocation}
                  className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition-all"
                  title="Share Coordinates Location"
                >
                  <MapPin className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  className="flex-grow p-2.5 bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary-500"
                  disabled={uploading}
                />

                <div className="hidden sm:flex items-center gap-1.5 px-1">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setInputText((prev) => prev + emoji)}
                      className="hover:scale-125 transition-transform text-sm p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
                >
                  {uploading ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <Send className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageSquare className="w-16 h-16 text-slate-300 animate-pulse" />
            <p className="text-sm font-semibold">Select a conversation to begin real-time coordinates.</p>
          </div>
        )}
      </div>

      {/* Floating Bottom Nav for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-850 py-2 px-6 flex justify-around md:hidden print:hidden">
        {[
          { id: 'main-home', label: 'Home', icon: Home, path: '/' },
          { id: 'dashboard', label: 'Dashboard', icon: Activity, path: getDashboardLink() },
          { id: 'requests', label: 'Feed', icon: Heart, path: getDashboardLink('requests') },
          { id: 'rewards', label: 'Wallet', icon: Gift, path: getDashboardLink('rewards') },
          { id: 'notifications', label: 'Alerts', icon: Bell, path: getDashboardLink('notifications') }
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center gap-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-all hover:scale-110 active:scale-95"
            >
              <ItemIcon className="w-5.5 h-5.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Fullscreen Image Zoom Overlay */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={previewImage} alt="Fullscreen preview" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button 
              type="button" 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatWorkspace;
