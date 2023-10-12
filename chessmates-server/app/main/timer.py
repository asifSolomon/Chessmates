import time


class TimerError(Exception):
    """A custom exception used to report errors in use of Timer class"""


class Timer:
    """
    class that handles chess clock
    """
    def __init__(self, seconds: int):
        """
        create a timer with x seconds
        """
        self._seconds = seconds
        self._start_time = None

    def resume(self):
        """resume the timer"""
        if self._start_time is not None:
            raise TimerError(f"Timer is running. Use .pause() to stop it")

        self._start_time = time.perf_counter()

    def pause(self):
        """Pause the timer"""
        if self._start_time is None:
            raise TimerError(f"Timer is not running. Use .resume() to start it")

        elapsed_time = time.perf_counter() - self._start_time
        self._seconds -= elapsed_time
        self._start_time = None
        if self._seconds < 0:
            raise TimerError("Time is up")

    def time_is_up(self, num: int):
        """
        checks if time is less than num
        """
        if self._start_time is not None:
            try:
                self.pause()
                self.resume()
            except TimerError:
                return True
        return self._seconds < num

    def __repr__(self):
        return f"Time remain: {self._seconds} seconds"
