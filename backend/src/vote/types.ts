export type Room = {
  roomId: number;
  bankId: number;
  creatorId: number;
  startDate: Date;
  endDate: Date | null;
  questionCount: number;
  users: { id: number; ready: boolean }[];
  countdown?: NodeJS.Timeout;
  isCountdownRunning?: boolean;
  votes: {
    [userId: number]: {
      [questionId: number]: boolean;
    };
  };
};

export type VoteMessageDto = {
  roomId: number;
  questionId: number;
  answer: boolean;
}

export type LeaveRoomMessageDto = {
  roomId: number
}

export type StopCountdownMessageDto = {
  roomId: number
}

export type JoinRoomMessageDto = {
  roomId: number
}

export type CheckRoomMessageDto = {
  roomId: number
}

export type ToggleReadyMessageDto = {
  roomId: number;
  ready: boolean;
}

export type CreateRoomMessageDto = {
  bankId: number;
}
