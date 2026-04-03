
export type Room = {
  roomId: number;
  bankId: number;
  users: { id: number, ready: boolean }[];
  countdown?: NodeJS.Timeout;
  isCountdownRunning?: boolean;
}