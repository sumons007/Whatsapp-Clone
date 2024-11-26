import { useEffect, useRef, useContext } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { GetApp as GetAppIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { AccountContext } from '../../../context/AccountProvider';
import { downloadMedia, formatDate } from '../../../utils/common-utils';
import { iconPDF } from '../../../constants/data';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

const Wrapper = styled(Box)`
    background: #FFFFFF;
    padding: 5px;
    max-width: 60%;
    width: fit-content;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
`;

const Own = styled(Box)`
    background: #dcf8c6;
    padding: 5px;
    max-width: 60%;
    width: fit-content;
    margin-left: auto;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
`;

const Text = styled(Typography)`
    font-size: 14px;
    padding: 0 5px 0 5px;
`;

const Time = styled(Typography)`
    font-size: 10px;
    color: #667781;
    margin-top: 6px;
    word-break: keep-all;
`;

const DoubleTick = styled(DoneAllIcon)`
    font-size: 13px;
    margin-left: 5px;
`;

const Message = ({ message }) => {
    const { account } = useContext(AccountContext);
    const messageRef = useRef(null);

    useEffect(() => {
        console.log('Setting up Intersection Observer');
        console.log(message);
        console.log(message?._id);

        let msId = message?._id || message?.conversationId;
        console.log(msId + '__sss');
        socket.emit('markAsRead', msId);

        const observer = new IntersectionObserver(
            (entries) => {
                console.log('Intersection Observer callback');
                if (entries[0].isIntersecting && !message.read) {
                    console.log('Message is intersecting and not read');
                    alert('Message read status will be updated.');
                    socket.emit('markAsRead', msId);
                }
            },
            { threshold: 1.0 }
        );

        if (messageRef.current) {
            console.log('Observing message element:', messageRef.current);
            observer.observe(messageRef.current);
        } else {
            console.log(messageRef);
        }

        return () => {
            if (messageRef.current) {
                console.log('Unobserving message element:', messageRef.current);
                observer.unobserve(messageRef.current);
            }
        };
    }, [message]);

    return (
        <>
            {account.sub === message.senderId ? 
                <Own>
                    {message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />}
                </Own>
            : 
                <Wrapper>
                    {message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />}
                </Wrapper>
            }
        </>
    );
};

const MessageTick = ({ message }) => {
    const { account } = useContext(AccountContext);

    return (
        <>
            {account.sub === message.senderId ? 
                <DoubleTick style={{color:message.read ? '#4FC3F7' : '#919191'}}/>
            : 
                null
            }
        </>
    );
};

const TextMessage = ({ message }) => {
    return (
        <>
            {message?.text?.includes('https://www.youtube.com/watch') ? (
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex' }}>
                        <ReactPlayer url={message.text} controls width="300px" height="auto" />
                    </div>
                    <Time style={{ position: 'absolute', bottom: 0, right: 0 }}>
                        <GetAppIcon 
                            onClick={(e) => downloadMedia(e, message.text)} 
                            fontSize='small' 
                            style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }} 
                        />
                        {formatDate(message.createdAt)}
                        <MessageTick message={message} />
                    </Time>
                </div>
            ) : (
                <div style={{ position: 'relative', display: 'flex' }}>
                    <Text>{message.text}</Text>
                    <Time>
                        {formatDate(message.createdAt)}
                        <MessageTick message={message} />
                    </Time>
                </div>
            )}
        </>
    );
};

const ImageMessage = ({ message }) => {
    return (
        <div style={{ position: 'relative' }}>
            {message?.text?.includes('.pdf') ? (
                <div style={{ display: 'flex' }}>
                    <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
                    <Typography style={{ fontSize: 14 }}>{message.text.split("/").pop()}</Typography>
                </div>
            ) : message?.text?.includes('.mp4') ? (
                <div style={{ display: 'flex' }}>
                    <ReactPlayer url={message.text} controls width="300px" height="auto" />
                </div>
            ) : (
                <img style={{ width: 300, height: '100%', objectFit: 'cover' }} src={message.text} alt={message.text} />
            )}
            <Time style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <GetAppIcon 
                    onClick={(e) => downloadMedia(e, message.text)} 
                    fontSize='small' 
                    style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }} 
                />
                {formatDate(message.createdAt)}
                <MessageTick message={message} />
            </Time>
        </div>
    );
};

export default Message; 
