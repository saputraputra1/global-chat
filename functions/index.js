const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const bannedWords = ['rasis', 'bullying', 'pelecehan', 'ancaman', 'kontol', 'memek', 'anjing', 'asu', 'bangsat', 'bajingan', 'brengsek', 'rasist', 'bully', 'harassment', 'threat', 'dick', 'pussy', 'dog', 'bitch', 'asshole'];

exports.censorMessages = functions.database.ref('/messages/{messageId}').onCreate(async (snapshot, context) => {
    const message = snapshot.val();
    const { content, senderId } = message;

    for (const word of bannedWords) {
        if (content.toLowerCase().includes(word)) {
            await snapshot.ref.update({ content: '***' });
            await admin.database().ref(`/bans/${senderId}`).set({
                permanent: true,
                reason: 'Menggunakan bahasa yang tidak pantas.',
                bannedBy: 'system',
                bannedAt: admin.database.ServerValue.TIMESTAMP
            });
            return;
        }
    }
});
