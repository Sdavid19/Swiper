import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { VoteService } from "./vote.service";
import { Socket, Server } from "socket.io";
import { UserService } from "../user/user.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class VoteGateway implements OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private voteService: VoteService,
    private userService: UserService
  ) {}

  async handleDisconnect(client: Socket) {
    const roomId: number = client.data.roomId;
    const userId: number = client.data.userId;

    if (!roomId || !userId) return;

    this.voteService.removeUser(roomId, userId);
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() { bankId, userId }: { bankId: number; userId: number },
    @ConnectedSocket() client: Socket
  ) {
    const roomId = this.voteService.createRoom(bankId);

    client.join(roomId.toString());
    client.data.roomId = roomId;
    client.data.userId = userId;

    this.voteService.addUser(roomId, userId);

    client.emit('roomCreated', { roomId, bankId });
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() { roomId, userId }: { roomId: number; userId: number },
    @ConnectedSocket() client: Socket
  ) {
    const room = this.voteService.getRoom(roomId);
    if (!room) {
      client.emit('joinError', 'Room not found');
      return;
    }

    client.join(roomId.toString());
    client.data.roomId = roomId;
    client.data.userId = userId;

    this.voteService.addUser(roomId, userId);
    client.emit('joinedRoom', { roomId, bankId: room.bankId });
    await this.sendRoomUsers(roomId);
  }

@SubscribeMessage('toggleReady')
async toggleReady(
  @MessageBody() { roomId, userId, ready }: { roomId: number; userId: number; ready: boolean },
  @ConnectedSocket() client: Socket
) {
  const room = this.voteService.getRoom(roomId);
  if (!room) return;

  this.voteService.setUserReady(roomId, userId, ready);
  await this.sendRoomUsers(roomId);

  if (this.voteService.isEveryoneReady(roomId)) {

    if (!room.isCountdownRunning) {
      this.startCountdown(roomId);
    }
  } else {
    // ha valaki unready lett, töröljük a countdownot
    this.voteService.clearCountdown(roomId);
    room.isCountdownRunning = false;
    this.server.to(roomId.toString()).emit('countdownCanceled');
  }
}

  private startCountdown(roomId: number) {
    const room = this.voteService.getRoom(roomId);
    if (!room || room.isCountdownRunning) return;

    room.isCountdownRunning = true;
    let countdownValue = 5;

    this.server.to(roomId.toString()).emit('countdownStart', countdownValue);

    const interval = setInterval(() => {
      const currentRoom = this.voteService.getRoom(roomId);

      if (!currentRoom || !currentRoom.isCountdownRunning) {
        clearInterval(interval);
        return;
      }

      countdownValue--;

      if (countdownValue > 0) {
        this.server.to(roomId.toString()).emit('countdownTick', countdownValue);
      } else {
        clearInterval(interval);
        this.voteService.clearCountdown(roomId);
        currentRoom.isCountdownRunning = false;

        this.server.to(roomId.toString()).emit('gameStart', { roomId });
      }
    }, 1000);

    this.voteService.setCountdown(roomId, interval);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() { roomId, userId }: { roomId: number; userId: number },
    @ConnectedSocket() client: Socket
  ) {
    const room = this.voteService.getRoom(roomId);
    if (!room) return;

    this.voteService.removeUser(roomId, userId);
    client.leave(roomId.toString());

    await this.sendRoomUsers(roomId);

    client.emit('leftRoom', { roomId });

    const remainingUsers = this.voteService.getUsers(roomId);
    if (remainingUsers.length === 0) {
      this.voteService.deleteRoom(roomId);
      console.log(`Room ${roomId} closed because it's empty`);
    } else {
      if (!this.voteService.isEveryoneReady(roomId)) {
        this.voteService.clearCountdown(roomId);
        this.server.to(roomId.toString()).emit('countdownCanceled');
      }
    }
  }

  private async sendRoomUsers(roomId: number) {
  const roomUsers = this.voteService.getUsers(roomId);
  
  const fullUsers = await Promise.all(
    roomUsers.map(async u => {
      const userData = await this.userService.findUserById(u.id);
      return {
        ...userData,
        ready: u.ready
      };
    })
  );

  this.server.to(roomId.toString()).emit('roomUsers', fullUsers);
}

  @SubscribeMessage('checkRoom')
checkRoom(
  @MessageBody() { roomId }: { roomId: number },
  @ConnectedSocket() client: Socket
) {
  const room = this.voteService.getRoom(Number(roomId));
  return { ok: !!room, roomId: Number(roomId) };
}

@SubscribeMessage('stopCountdown')
stopCountdown(
  @MessageBody() { roomId }: { roomId: number }
) {
  const room = this.voteService.getRoom(roomId);
  if (!room) return;

  this.voteService.clearCountdown(roomId);
  room.isCountdownRunning = false;

  this.server.to(roomId.toString()).emit('countdownCanceled');
}
}