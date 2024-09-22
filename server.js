const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the "UserUploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'UserUploads')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
