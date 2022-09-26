enum ANSWER {
  WRONG = 'WRONG',
  RIGHT = 'RIGHT',
}

enum GAME {
  SPRINT = 'sprint',
  AUDIOCALL = 'audiocall',
}

enum PAGE {
  HOME = 'home',
  TEXTBOOK = 'textbook',
  GAMES = 'games',
  GAMESPRINT = 'games/sprint',
  GAMEAUDIOCALL = 'games/audiocall',
  PLAYSPRINT = 'play/sprint',
  PLAYAUDIOCALL = 'play/audiocall',
  STATISTIC = 'statistic',
}

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum ICON {
  SPEAKER = 'speaker',
  CLOSE = 'close',
}

enum CUSTOMEVENT {
  GAMESTATISTIC = 'gameStatistic',
}

enum AUDIOGAME {
  NEXTWORD = 'Next word',
  SHOWANSWER = "I don't know",
  SHOWRESULTS = 'Show results',
  AMOUNTOFWORDS = 20,
  AMOUNTOFANSWERS = 5,
  ENTER = 'Enter',
  SPACE = ' ',
  STATUSWAITING = 'waiting',
  STATUSDONE = 'done',
}

enum DIFFICULTY {
  NONE = 'none',
  NEW = 'new',
  HARD = 'hard',
  LEARN = 'learn',
}

enum WINSNEEDED {
  NEW = 3,
  HARD = 5,
}

export {
  ANSWER, GAME, PAGE, METHOD, ICON, DIFFICULTY, WINSNEEDED, CUSTOMEVENT, AUDIOGAME,
};
