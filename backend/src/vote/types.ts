export type Room = {
  roomId: number;
  bankId: number;
  startDate: Date;
  endDate: Date | null;
  questionCount: number;
  users: { id: number, ready: boolean }[];
  countdown?: NodeJS.Timeout;
  isCountdownRunning?: boolean;
  votes: {
    [userId: number]: {
      [questionId: number]: boolean;
    };
  };
};