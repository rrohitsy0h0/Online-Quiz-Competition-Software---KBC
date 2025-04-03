import { startTimer, resetTimer, startQuestionTimer } from '../../utils/timer';
import { describe, beforeEach, jest, afterEach, expect, it } from '@jest/globals';

describe('Timer Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global.console, 'log').mockImplementation(() => {}); // suppress logs
  });

  afterEach(() => {
    jest.useRealTimers();
    (console.log as jest.Mock).mockRestore();
  });

  describe('startTimer', () => {
    it('should call callback after timer expires', () => {
      const callback = jest.fn();
      // Provide a timer duration of 3 seconds
      startTimer(3, callback);
      
      // Since the timer decrements before checking, advance by 4000ms instead of 3000ms
      jest.advanceTimersByTime(4000);
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('resetTimer', () => {
    it('should return the input duration', () => {
      const duration = 60;
      expect(resetTimer(duration)).toBe(duration);
    });
  });

  describe('startQuestionTimer', () => {
    it('should trigger onTimeout after timer expires', () => {
      const onTimeout = jest.fn();
      // Provide a timer duration of 3 seconds
      startQuestionTimer(3, onTimeout);
      
      // Advance timers by 4000ms to allow the callback to be triggered
      jest.advanceTimersByTime(4000);
      
      expect(onTimeout).toHaveBeenCalled();
    });
  });
});
