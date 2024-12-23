import Message from "../modal/Message.js";
import Conversation from '../modal/Conversation.js';


export const newMessage = async (request, response) => { 
    const newMessage = new Message(request.body);
    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text });
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}
export const markAsRead = async (request, response) => {
    try {
        const messageId = request.params.id;
        await Message.findByIdAndUpdate(messageId, { read: true });
        response.status(200).json("Message marked as read");
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }

}