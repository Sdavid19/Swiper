import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { RoomService } from './services/room.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class VoteGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async handleDisconnect(client: Socket) {
    const roomId: number = client.data.roomId;
    const userId: number = client.data.userId;

    if (!roomId || !userId) return;

    this.roomService.removeUser(roomId, userId);
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody()
    {
      bankId,
      userId,
    }: { bankId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId =
      await this.roomService.createRoom(bankId);

    client.join(roomId.toString());
    client.data.roomId = roomId;
    client.data.userId = userId;

    this.roomService.addUser(roomId, userId);

    client.emit('roomCreated', {
      roomId,
      bankId,
    });
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody()
    {
      roomId,
      userId,
    }: { roomId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      client.emit('joinError', 'Room not found');
      return;
    }

    client.join(roomId.toString());
    client.data.roomId = roomId;
    client.data.userId = userId;

    this.roomService.addUser(roomId, userId);
    client.emit('joinedRoom', {
      roomId,
      bankId: room.bankId,
    });
    await this.sendRoomUsers(roomId);
  }

  @SubscribeMessage('toggleReady')
  async toggleReady(
    @MessageBody()
    {
      roomId,
      userId,
      ready,
    }: {
      roomId: number;
      userId: number;
      ready: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.setUserReady(
      roomId,
      userId,
      ready,
    );
    await this.sendRoomUsers(roomId);

    if (
      this.roomService.isEveryoneReady(roomId)
    ) {
      if (!room.isCountdownRunning) {
        this.startCountdown(roomId);
      }
    } else {
      this.roomService.clearCountdown(roomId);
      room.isCountdownRunning = false;
      this.server
        .to(roomId.toString())
        .emit('countdownCanceled');
    }
  }

  private startCountdown(roomId: number) {
    const room = this.roomService.getRoom(roomId);
    if (!room || room.isCountdownRunning) return;

    room.isCountdownRunning = true;
    let countdownValue = 5;

    this.server
      .to(roomId.toString())
      .emit('countdownStart', countdownValue);

    const interval = setInterval(() => {
      const currentRoom =
        this.roomService.getRoom(roomId);

      if (
        !currentRoom ||
        !currentRoom.isCountdownRunning
      ) {
        clearInterval(interval);
        return;
      }

      countdownValue--;

      if (countdownValue > 0) {
        this.server
          .to(roomId.toString())
          .emit('countdownTick', countdownValue);
      } else {
        clearInterval(interval);
        this.roomService.clearCountdown(roomId);
        currentRoom.isCountdownRunning = false;

        this.server
          .to(roomId.toString())
          .emit('gameStart', { roomId });
      }
    }, 1000);

    this.roomService.setCountdown(
      roomId,
      interval,
    );
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody()
    {
      roomId,
      userId,
    }: { roomId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.removeUser(roomId, userId);
    client.leave(roomId.toString());

    await this.sendRoomUsers(roomId);

    client.emit('leftRoom', { roomId });

    const remainingUsers =
      this.roomService.getUsers(roomId);
    if (remainingUsers.length === 0) {
      this.roomService.deleteRoom(roomId);
      console.log(
        `Room ${roomId} closed because it's empty`,
      );
    } else {
      if (
        !this.roomService.isEveryoneReady(roomId)
      ) {
        this.roomService.clearCountdown(roomId);
        this.server
          .to(roomId.toString())
          .emit('countdownCanceled');
      }
    }
  }

  private async sendRoomUsers(roomId: number) {
    const roomUsers =
      this.roomService.getUsers(roomId);

    const fullUsers = await Promise.all(
      roomUsers.map(async (u) => {
        const userData =
          await this.userService.findUserById(
            u.id,
          );
        return {
          ...userData,
          ready: u.ready,
        };
      }),
    );

    this.server
      .to(roomId.toString())
      .emit('roomUsers', fullUsers);
  }

  @SubscribeMessage('checkRoom')
  checkRoom(
    @MessageBody() { roomId }: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomService.getRoom(
      Number(roomId),
    );
    return { ok: !!room, roomId: Number(roomId) };
  }

  @SubscribeMessage('stopCountdown')
  stopCountdown(
    @MessageBody() { roomId }: { roomId: number },
  ) {
    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    this.roomService.clearCountdown(roomId);
    room.isCountdownRunning = false;

    this.server
      .to(roomId.toString())
      .emit('countdownCanceled');
  }

  @SubscribeMessage('vote')
  async vote(
    @MessageBody()
    {
      roomId,
      userId,
      questionId,
      answer,
    }: {
      roomId: number;
      userId: number;
      questionId: number;
      answer: boolean;
    },
  ) {
    const savedVote = await this.roomService.vote(
      roomId,
      userId,
      questionId,
      answer,
    );
    if (savedVote) {
      this.server
        .to(roomId.toString())
        .emit('gameEnded', {
          voteId: savedVote.id,
        });
    }
  }
}
