import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { RoomService } from './room.service';
import { VoteService } from './vote.service';
import { QuestionBankService } from '../../question-bank/services/question-bank.service';

describe('RoomService', () => {
  let service: RoomService;

  const mockBankService = {
    findQuestionsByBank: jest.fn(),
  };

  const mockVoteService = {
    createVoteData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          RoomService,
          {
            provide: QuestionBankService,
            useValue: mockBankService,
          },
          {
            provide: VoteService,
            useValue: mockVoteService,
          },
        ],
      }).compile();

    service = module.get(RoomService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (service as any).rooms = new Map();
  });

  it('should create a room with correct question count', async () => {
    mockBankService.findQuestionsByBank.mockResolvedValue(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
    );

    const roomId = await service.createRoom(1);

    const room = service.getRoom(roomId);

    expect(room).toBeDefined();
    expect(room?.questionCount).toBe(3);
    expect(room?.bankId).toBe(1);
  });

  it('should add user to room', async () => {
    mockBankService.findQuestionsByBank.mockResolvedValue(
      [],
    );

    const roomId = await service.createRoom(1);

    service.addUser(roomId, 10);

    const users = service.getUsers(roomId);

    expect(users.length).toBe(1);
    expect(users[0].id).toBe(10);
  });

  it('should detect when everyone is ready', async () => {
    mockBankService.findQuestionsByBank.mockResolvedValue(
      [],
    );

    const roomId = await service.createRoom(1);

    service.addUser(roomId, 1);
    service.setUserReady(roomId, 1, true);

    expect(service.isEveryoneReady(roomId)).toBe(
      true,
    );
  });

  it('should save votes when everyone voted', async () => {
    mockBankService.findQuestionsByBank.mockResolvedValue(
      [{ id: 1 }],
    );

    mockVoteService.createVoteData.mockResolvedValue(
      { id: 1 },
    );

    const roomId = await service.createRoom(1);

    service.addUser(roomId, 1);

    const result = service.vote(
      roomId,
      1,
      1,
      true,
    );

    expect(
      mockVoteService.createVoteData,
    ).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should delete room when last user leaves', async () => {
    mockBankService.findQuestionsByBank.mockResolvedValue(
      [],
    );

    const roomId = await service.createRoom(1);

    service.addUser(roomId, 1);
    service.removeUser(roomId, 1);

    expect(
      service.getRoom(roomId),
    ).toBeUndefined();
  });
});
