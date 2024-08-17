export function timeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const seconds = Math.floor((now - postDate) / 1000);
  const interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return `1 year ago`;

  const months = Math.floor(seconds / 2592000);
  if (months > 1) return `${months} months ago`;
  if (months === 1) return `1 month ago`;

  const days = Math.floor(seconds / 86400);
  if (days > 1) return `${days} days ago`;
  if (days === 1) return `1 day ago`;

  const hours = Math.floor(seconds / 3600);
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return `1 hour ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) return `${minutes} minutes ago`;
  if (minutes === 1) return `1 minute ago`;

  return `just now`;
}
