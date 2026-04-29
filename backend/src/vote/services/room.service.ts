import { Injectable } from '@nestjs/common';
import { Room } from '../types';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { VoteService } from './vote.service';
import { QuestionService } from '../../question/services/question.service';

@Injectable()
export class RoomService {
  private rooms: Map<number, Room> = new Map();

  constructor(
    private readonly questionService: QuestionService,
    private readonly voteService: VoteService,
  ) { }

  async createRoom(bankId: number, creatorId: number,): Promise<number> {
    let roomId: number;

    do {
      roomId = Math.floor(100000 + Math.random() * 900000);
    } while (this.rooms.has(roomId));

    const questions = await this.questionService.findQuestionsByBank(bankId);

    this.rooms.set(roomId, {
      roomId,
      bankId,
      creatorId,
      startDate: new Date(),
      endDate: null,
      users: [],
      questionCount: questions.length,
      countdown: undefined,
      isCountdownRunning: false,
      votes: {},
    });

    return roomId;
  }

  getRoom(roomId: number): Room | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.countdown) {
      clearTimeout(room.countdown);
    }

    this.rooms.delete(roomId);
  }

  addUser(roomId: number, userId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (!room.users.find((u) => u.id === userId)) {
      room.users.push({ id: userId, ready: false, });
    }
  }

  removeUser(roomId: number, userId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users = room.users.filter((u) => u.id !== userId);

    delete room.votes[userId];

    if (room.users.length === 0) {
      if (room.countdown) clearTimeout(room.countdown);
      this.rooms.delete(roomId);
    }
  }

  getUsers(roomId: number) {
    const room = this.rooms.get(roomId);
    return room ? room.users : [];
  }

  setUserReady(roomId: number, userId: number, ready: boolean) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const user = room.users.find((u) => u.id === userId);
    if (user) user.ready = ready;
  }

  isEveryoneReady(roomId: number): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    return room.users.length > 0 && room.users.every((u) => u.ready);
  }

  setCountdown(roomId: number, countdown: NodeJS.Timeout) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.countdown = countdown;
  }

  clearCountdown(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.countdown) {
      clearTimeout(room.countdown);
      room.countdown = undefined;
    }
  }

  async vote(roomId: number, userId: number, questionId: number, answer: boolean) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (!room.votes[userId]) {
      room.votes[userId] = {};
    }

    room.votes[userId][questionId] = answer;

    //ha az utolsó szavazat is meg volt, el lehet menteni
    if (this.isEveryoneVoted(roomId)) {
      const room = this.rooms.get(roomId);
      if (!room) return;
      room.endDate = new Date();
      return await this.saveVotes(roomId);
    }
    return null;
  }

  isEveryoneVoted(roomId: number): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    return room.users.every((user) => {
      const userVotes = room.votes[user.id];
      return userVotes && Object.keys(userVotes).length === room.questionCount;
    });
  }

  async saveVotes(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const asnwers = Object.entries(room.votes).flatMap(([userId, questions]) => {
      return Object.entries(questions).map(
        ([questionId, answer]) =>
          ({
            userId: Number(userId),
            questionId: Number(questionId),
            answer,
          }) as CreateAnswerDto,
      );
    });

    return await this.voteService.createVoteData({
      answers: asnwers,
      bankId: room.bankId,
      creatorId: room.creatorId,
      startDate: room.startDate,
      endDate: new Date(),
    });
  }
}
