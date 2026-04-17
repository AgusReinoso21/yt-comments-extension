\# YouTube Comments Analyzer



Chrome extension that fetches, filters, and ranks YouTube comments by year using the YouTube Data API.



\---



\## 🚀 Features



\* Filter comments by specific year

\* Rank comments by likes

\* Display top comments with badges 🥇🥈🥉

\* Local caching for faster reloads

\* Clean UI with progress tracking



\---



\## 🛠️ Tech Stack



\* TypeScript

\* Chrome Extensions API (Manifest V3)

\* YouTube Data API

\* Vanilla JavaScript (compiled from TS)



\---



\## 📂 Project Structure



```

yt-comments-extension/

│

├── src/              # TypeScript source code

├── dist/             # Compiled JavaScript

├── popup.html        # Extension UI

├── styles.css

├── manifest.json

├── tsconfig.json

├── package.json

└── .gitignore

```



\---



\## ⚙️ Installation



1\. Clone the repository:



```

git clone https://github.com/your-username/yt-comments-extension.git

```



2\. Install dependencies:



```

npm install

```



3\. Build the project:



```

npm run build

```



4\. Load the extension in Chrome:



\* Go to: `chrome://extensions/`

\* Enable \*\*Developer Mode\*\*

\* Click \*\*Load unpacked\*\*

\* Select the project folder



\---



\## 🔐 API Key Setup



This project uses the YouTube Data API.



Create a file:



```

src/config.ts

```



And add:



```ts

export const API\_KEY = "YOUR\_API\_KEY";

```



⚠️ This file is ignored by `.gitignore` to protect your key.



\---



\## 🧠 How it Works



1\. Gets the current YouTube video ID

2\. Fetches comments using the API

3\. Filters by selected year

4\. Sorts by likes

5\. Displays top results with ranking



\---



\## 📌 Future Improvements



\* Backend (Node.js + SQL) for persistent storage

\* Advanced analytics (trends, engagement)

\* Sentiment analysis

\* UI/UX improvements

\* Pagination and performance optimizations



\---



\## ⚠️ Notes



\* API quotas may limit the number of requests

\* Extension only works on YouTube video pages



\---



\## 📄 License



MIT



