import { API_KEY } from "./config";

type Comment = {
  text: string;
  date: string;
  likes: number;
  author: string;
};

type CachePayload = {
  timestamp: number;
  data: Comment[];
};

const MAX_FETCH = 800;
const TARGET_COMMENTS = 150;

// MAIN ENTRY
const form = document.getElementById("form") as HTMLFormElement;

form.onsubmit = async (event: SubmitEvent) => {
  event.preventDefault();

  const yearInput = document.getElementById("year") as HTMLInputElement;
  const year = parseInt(yearInput.value);

  if (!year) return alert("Enter a valid year");

  const videoId = await getVideoId();
  if (!videoId) return alert("Not a YouTube video");

  const container = document.getElementById("results") as HTMLElement;

  const cached = getFromCache(videoId, year);

  if (cached) {
    container.innerHTML = "Loaded from cache ⚡";
    render(cached);
    return;
  }

  container.innerHTML = "Loading...";

  try {
    let comments = await fetchCommentsByYear(videoId, year);

    comments = getTopComments(comments, TARGET_COMMENTS);

    saveToCache(videoId, year, comments);

    updateProgress(0, "Starting...");

    render(comments);

  } catch (error) {
    console.error(error);
    container.innerHTML = "Error loading comments";
  }
};

//SAVE CACHE
function saveToCache(videoId: string, year: number, data: Comment[]): void {
  const key = `yt-comments-${videoId}-${year}`;
  const payload: CachePayload = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(payload));
}


//GET CACHE
function getFromCache(videoId: string, year: number): Comment[] | null {
  const key = `yt-comments-${videoId}-${year}`;
  const cached = localStorage.getItem(key);

  if (!cached) return null;

  try {
    const parsed: CachePayload = JSON.parse(cached);

    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (Date.now() - parsed.timestamp > ONE_DAY) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

// GET VIDEO ID
async function getVideoId(): Promise<string | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) return null;

  const url = new URL(tab.url);
  return url.searchParams.get("v");
}

// FETCH COMMENTS
async function fetchCommentsByYear(videoId: string, year: number): Promise<Comment[]> {
  let comments: Comment[] = [];
  let pageToken = "";
  let fetched = 0;

  while (comments.length < TARGET_COMMENTS) {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${pageToken}&key=${API_KEY}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!data.items) break;

    for (const item of data.items) {
      const commentSnippet = item.snippet.topLevelComment.snippet;
      const date = new Date(commentSnippet.publishedAt);

      fetched++;

      if (date.getFullYear() === year) {
        comments.push({
          text: commentSnippet.textDisplay,
          date: date.toDateString(),
          likes: commentSnippet.likeCount || 0,
          author: commentSnippet.authorDisplayName
        });
      }

      if (fetched >= MAX_FETCH) break;
    }

    let percent = Math.min((fetched / MAX_FETCH) * 100, 95);

    if (comments.length >= TARGET_COMMENTS) {
      percent = 100;
    }

    updateProgress(percent, `Analyzed: ${fetched} | Found: ${comments.length}`);

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return comments;
}

// UPDATE PROGRESS BAR
function updateProgress(percent: number, text: string = ""): void {
  const bar = document.getElementById("progress-bar") as HTMLElement;
  const label = document.getElementById("progress-text") as HTMLElement;

  bar.style.width = percent + "%";
  label.innerText = text;
}

function getTopComments(comments: Comment[], limit: number): Comment[] {
  return comments
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

// RENDER UI
function render(comments: Comment[]): void {
  const container = document.getElementById("results") as HTMLElement;
  container.innerHTML = "";

  if (comments.length === 0) {
    container.innerHTML = "No comments found.";
    return;
  }

  comments.forEach((comment, index) => {
    const rank = index + 1;

    const div = document.createElement("div");
    div.className = "comment";

    if (rank === 1) div.classList.add("top1");
    if (rank === 2) div.classList.add("top2");
    if (rank === 3) div.classList.add("top3");

    const badge = getBadge(rank);

    div.innerHTML = `
      <div class="date">${badge} #${rank} | 👍 ${comment.likes} | ${comment.date}</div>
      <div><b>${comment.author}</b></div>
      <div>${comment.text}</div>
    `;

    container.appendChild(div);
  });
}

// BADGES
function getBadge(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

