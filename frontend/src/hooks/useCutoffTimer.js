import { useState, useEffect } from 'react';

/**
 * Custom React Hook: useCutoffTimer
 * Provides real-time countdown to harvest pre-order packaging deadline.
 */
export function useCutoffTimer(targetCutoffDate = null) {
  // If no fixed cutoff provided, calculate the next cutoff cycle:
  // Pre-orders cutoff every Friday at 18:00 (6:00 PM) for weekend stall pickups.
  const getNextCutoff = () => {
    if (targetCutoffDate) return new Date(targetCutoffDate).getTime();
    
    const now = new Date();
    const result = new Date(now);
    
    // Day 5 is Friday
    const currentDay = now.getDay();
    const daysUntilFriday = (5 - currentDay + 7) % 7;
    
    result.setDate(now.getDate() + daysUntilFriday);
    result.setHours(18, 0, 0, 0); // 6:00 PM
    
    // If it's already past Friday 6:00 PM this week, move to next cycle
    if (result.getTime() <= now.getTime()) {
      result.setDate(result.getDate() + 7);
    }
    
    return result.getTime();
  };

  const [cutoffTimestamp] = useState(getNextCutoff);
  const [timeLeft, setTimeLeft] = useState(() => calculateRemaining(cutoffTimestamp));

  function calculateRemaining(target) {
    const diff = Math.max(0, target - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      totalSeconds,
      hours,
      minutes,
      seconds,
      isExpired: totalSeconds <= 0,
      isUrgent: totalSeconds > 0 && totalSeconds <= 10800, // < 3 hours
      isCritical: totalSeconds > 0 && totalSeconds <= 3600 // < 1 hour
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining(cutoffTimestamp));
    }, 1000);

    return () => clearInterval(timer);
  }, [cutoffTimestamp]);

  const pad = (n) => String(n).padStart(2, '0');
  const formattedString = `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;

  return {
    ...timeLeft,
    formattedString,
    cutoffTimestamp
  };
}
