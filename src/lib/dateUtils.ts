
export const getLocalDateString = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDisplayDate = (dateStr: string) => {
  const date = parseLocalDate(dateStr);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatDisplayDateTime = (isoStr: string) => {
  const date = new Date(isoStr);
  return {
    date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
