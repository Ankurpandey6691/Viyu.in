# 🔥 Firebase Setup Required

The Social Authentication (Google/Facebook) buttons will not work until you connect them to a Firebase project.

### Step 1: Create a Firebase Project
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the steps.
3.  Once created, click the **Web icon `</>`** to add a web app.
4.  Copy the `firebaseConfig` keys shown on the screen.

### Step 2: Add Keys to Your Project
1.  Open the file: `frontend/.env` in your editor.
2.  Fill in the values like this:

```env
VITE_FIREBASE_API_KEY=AIzaSyD... (your real key)
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456...
```

### Step 3: Enable Google & Facebook Sign-In
1.  In Firebase Console, go to **Authentication** -> **Sign-in method**.
2.  Click **Add new provider** -> **Google** -> Enable it.
3.  Click **Add new provider** -> **Facebook** -> Enable it (You will need a Facebook App ID for this, or just test Google first).

### Step 4: Restart Server
After saving the `.env` file, **restart your development server**:
1.  Click in the terminal.
2.  Press `Ctrl + C`.
3.  Run `npm run dev` again.
