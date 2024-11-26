import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = `mongodb://${username}:${password}@ac-fx5seyu-shard-00-00.hteqb4w.mongodb.net:27017,ac-fx5seyu-shard-00-01.hteqb4w.mongodb.net:27017,ac-fx5seyu-shard-00-02.hteqb4w.mongodb.net:27017/?ssl=true&replicaSet=atlas-cn6fy5-shard-0&authSource=admin&retryWrites=true&w=majority&appName=whatsupclon`;

    try {
        await mongoose.connect(URL, { 
            useUnifiedTopology: true, 
            serverSelectionTimeoutMS: 50000, // Increased timeout
            socketTimeoutMS: 60000, // Increased timeout
            useNewUrlParser: true,
            useFindAndModify: true // To avoid deprecation warnings
        });
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log('Error: ', error.message);
    }
};


// Function to update the 'read' status of a message by its _id
const updateReadStatus = async (messageId) => {
    try {
        const result = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true } // This option returns the updated document
        );
        console.log('Message Updated:', result);
    } catch (error) {
        console.log('Error updating message:', error.message);
    }
};

// Example usage
const messageId = '66a24263faf91c421ce10b9d'; // Replace with the actual message ID
updateReadStatus(messageId);

export default Connection;
