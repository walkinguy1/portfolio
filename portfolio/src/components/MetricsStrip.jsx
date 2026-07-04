/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { IDENTITY } from '../data/portfolioData';

const CACHE_KEY = 'portfolio-github-metrics-v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

async function fetchGitHubMetrics(username) {
  try {
    // Fetch user profile + recent events in parallel
    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`),
    ]);

    if (!userRes.ok) throw new Error('GitHub API failed');

    const user = await userRes.json();
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Count push events this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const pushEvents = events.filter(
      e => e.type === 'PushEvent' && new Date(e.created_at) >= monthStart
    );
    const commitsThisMonth = pushEvents.reduce(
      (sum, e) => sum + (e.payload?.commits?.length || e.payload?.size || 1), 0
    );

    // Calculate streak from push events
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pushDays = new Set(
      events
        .filter(e => e.type === 'PushEvent')
        .map(e => {
          const d = new Date(e.created_at);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );
    for (let i = 0; i < 90; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() - i);
      const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
      if (pushDays.has(key)) {
        streak++;
      } else if (i > 0) {
        break; // allow today to be missing (hasn't pushed yet today)
      }
    }

    // Last push time
    const lastPush = user.pushed_at || (events[0]?.created_at) || null;

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      commitsThisMonth,
      streak,
      lastPush: lastPush ? relativeTime(lastPush) : 'N/A',
      fetchedAt: Date.now(),
    };
  } catch (err) {
    console.warn('GitHub metrics fetch failed:', err);
    return null;
  }
}

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.fetchedAt > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

export const MetricsStrip = () => {
  const [metrics, setMetrics] = useState(getCached);
  const [loading, setLoading] = useState(!getCached());

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setMetrics(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchGitHubMetrics(IDENTITY.githubUsername).then(data => {
      if (data) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setMetrics(data);
      }
      setLoading(false);
    });
  }, []);

  const items = metrics
    ? [
        { icon: '📦', label: 'Public repos', value: metrics.publicRepos },
        { icon: '🔥', label: 'Commits this month', value: metrics.commitsThisMonth },
        { icon: '⚡', label: 'Streak', value: `${metrics.streak} days` },
        { icon: '🕐', label: 'Last push', value: metrics.lastPush },
        { icon: '👥', label: 'Followers', value: metrics.followers },
      ]
    : [];

  return (
    <section className="metrics-strip" aria-label="Live coding metrics">
      <div className="metrics-strip-inner">
        <div className="metrics-strip-badge">
          <span className="metrics-live-dot" />
          <span>LIVE</span>
        </div>

        <div className="metrics-strip-items">
          {loading && !metrics && (
            <>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="metrics-item metrics-item--skeleton">
                  <span className="metrics-skeleton-bar" />
                </div>
              ))}
            </>
          )}

          {items.map((item, i) => (
            <div key={i} className="metrics-item">
              <span className="metrics-icon" aria-hidden="true">{item.icon}</span>
              <span className="metrics-value">{item.value}</span>
              <span className="metrics-label">{item.label}</span>
            </div>
          ))}
        </div>

        <a
          href={IDENTITY.github}
          target="_blank"
          rel="noreferrer"
          className="metrics-gh-link"
          aria-label="View GitHub profile"
        >
          GitHub ↗
        </a>
      </div>
    </section>
  );
};
