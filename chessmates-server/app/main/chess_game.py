import chess
import itertools
from .timer import Timer, TimerError


class Game:
    """
    class that handles chess game
    """
    def __init__(self, time: int):
        """
        creates a new game
        """
        self._board = chess.Board()
        self._game_over = False
        self._colors = itertools.cycle(["white", "black"])
        self._turn = next(self._colors)
        self._clock = {
            "white": Timer(time),
            "black": Timer(time)
        }
        self._clock["white"].resume()

    def get_fen(self):
        """
        return current position in string format FEN
        """
        return self._board.board_fen()

    def check_time(self):
        """
        checks if time is up
        """
        white = self._clock["white"]
        black = self._clock["black"]
        if white.time_is_up(15):
            self._game_over = True
            return {
                "text": "white lost by time",
                "res": f"black won"
            }
        elif black.time_is_up(15):
            self._game_over = True
            return {
                "text": "black lost by time",
                "res": f"white won"
            }
        else:
            return "ok"

    def possible_move(self, color: str, uci_move: str):
        """
        checks if move is possible and do it
        """
        try:
            if color != self._turn or self._game_over:
                raise ValueError
            self._board.push_uci(uci_move)

            try:
                self._clock[self._turn].pause()
                self._game_over = self._board.is_game_over()
            except TimerError:
                self._game_over = True
                return {
                    "text": f"{self._turn} lost by time",
                    "res": f"{next(self._colors)} won"
                }
            if not self.game_over:
                self._turn = next(self._colors)
                self._clock[self._turn].resume()
            print(self._clock)
            return True
        except ValueError as e:
            return False

    def game_status(self):
        """
        return the game result if game is over
        """
        if self._game_over:
            if self._board.is_stalemate():
                return {
                    "text": "Stalemate",
                    "res": "draw"
                }
            elif self._board.is_seventyfive_moves():
                return {
                    "text": "75 moves",
                    "res": "draw"
                }
            elif self._board.is_checkmate():
                return {
                    "text": "Checkmate",
                    "res": f"{self._turn} won"
                }
            elif self._board.is_insufficient_material():
                return {
                    "text": "Insufficient material",
                    "res": "draw"
                }
            elif self._board.is_fivefold_repetition():
                return {
                    "text": "Repetition",
                    "res": "draw"
                }

    # getters
    @property
    def game_over(self):
        return self._game_over

    @property
    def board(self):
        return self._board

