import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomService } from './services/room.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/services/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class VoteGateway
  implements
  OnGatewayConnection,
  OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const user = await this.authService.verifyToken(token);

      client.data.userId = user.id;
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    const userId = client.data.userId;

    if (!roomId || !userId) return;

    this.roomService.removeUser(roomId, userId);
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() { bankId }: { bankId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const roomId = await this.roomService.createRoom(bankId, userId);

    client.join(roomId.toString());
    client.data.roomId = roomId;

    this.roomService.addUser(roomId, userId);
    client.emit('roomCreated', { roomId, bankId });

    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() { roomId }: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const room = this.roomService.getRoom(roomId);

    if (!room) {
      client.emit('joinError', 'Room not found');
      return;
    }

    if (room.users.map((user) => user.id).includes(userId)) {
      client.emit('joinError', 'A user already joined with this account!',);
      return;
    }

    client.join(roomId.toString());
    client.data.roomId = roomId;

    this.roomService.addUser(roomId, userId);

    client.emit('joinedRoom', { roomId, bankId: room.bankId });

    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('toggleReady')
  async toggleReady(
    @MessageBody()
    {
      roomId,
      ready,
    }: {
      roomId: number;
      ready: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.setUserReady(roomId, userId, ready,);

    await this.sendRoomUsers(roomId);

    if (this.roomService.isEveryoneReady(roomId)) {
      if (!room.isCountdownRunning) {
        this.startCountdown(roomId);
      }
    } else {
      this.roomService.clearCountdown(roomId);
      room.isCountdownRunning = false;

      this.server.to(roomId.toString()).emit('countdownCanceled');
    }
  }

  @SubscribeMessage('vote')
  async vote(
    @MessageBody()
    {
      roomId,
      questionId,
      answer,
    }: {
      roomId: number;
      questionId: number;
      answer: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    const savedVote = await this.roomService.vote(roomId, userId, questionId, answer);

    if (savedVote) {
      this.server.to(roomId.toString()).emit('gameEnded', { voteId: savedVote.id });
    }
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() { roomId }: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.removeUser(roomId, userId);

    client.leave(roomId.toString());

    await this.sendRoomUsers(roomId);

    client.emit('leftRoom', { roomId, userId });

    const remainingUsers = this.roomService.getUsers(roomId);

    if (remainingUsers.length === 0) {
      this.roomService.deleteRoom(roomId);
      console.log(`Room ${roomId} closed because it's empty.`);
    } else {
      if (
        !this.roomService.isEveryoneReady(roomId)
      ) {
        this.roomService.clearCountdown(roomId);
        this.server.to(roomId.toString()).emit('countdownCanceled');
      }
    }
  }

  @SubscribeMessage('checkRoom')
  checkRoom(
    @MessageBody() { roomId }: { roomId: number },
  ) {
    const room = this.roomService.getRoom(roomId);
    return { ok: !!room, roomId };
  }

  @SubscribeMessage('stopCountdown')
  stopCountdown(
    @MessageBody() { roomId }: { roomId: number },
  ) {
    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.clearCountdown(roomId);
    room.isCountdownRunning = false;

    this.server.to(roomId.toString()).emit('countdownCanceled');
  }

  private startCountdown(roomId: number) {
    const room = this.roomService.getRoom(roomId);
    if (!room || room.isCountdownRunning) return;

    room.isCountdownRunning = true;

    let countdown = 5;

    this.server.to(roomId.toString()).emit('countdownStart', countdown);

    const interval = setInterval(() => {
      const currentRoom = this.roomService.getRoom(roomId);

      if (!currentRoom || !currentRoom.isCountdownRunning) {
        clearInterval(interval);
        return;
      }

      countdown--;

      if (countdown > 0) {
        this.server.to(roomId.toString()).emit('countdownTick', countdown);
      }
      else {
        clearInterval(interval);
        this.roomService.clearCountdown(roomId);
        currentRoom.isCountdownRunning = false;
        this.server.to(roomId.toString()).emit('gameStart', { roomId });
      }
    }, 1000);

    this.roomService.setCountdown(roomId, interval);
  }

  private async sendRoomUsers(roomId: number) {
    const roomUsers = this.roomService.getUsers(roomId);

    const fullUsers = await Promise.all(
      roomUsers.map(async (u) => {
        const userData =
          await this.userService.findUserById(
            u.id,
          );

        return { ...userData, ready: u.ready };
      }),
    );

    this.server.to(roomId.toString()).emit('roomUsers', fullUsers);
  }
}
