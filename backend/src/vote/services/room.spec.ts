import { RoomService } from './room.service';
import { QuestionService } from '../../question/services/question.service';
import { VoteService } from './vote.service';

describe('RoomService', () => {
  let roomService: RoomService;

  const questionServiceMock = {
    findQuestionsByBank: jest.fn(),
  } as unknown as QuestionService;

  const voteServiceMock = {
    createVoteData: jest.fn(),
  } as unknown as VoteService;

  const mockFindQuestions = questionServiceMock.findQuestionsByBank as jest.Mock;
  const mockCreateVoteData = voteServiceMock.createVoteData as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    roomService = new RoomService(questionServiceMock, voteServiceMock,);
  });

  describe('createRoom', () => {
    it('should create a room with questions', async () => {
      mockFindQuestions.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const roomId = await roomService.createRoom(1, 10);
      const room = roomService.getRoom(roomId);

      expect(room).toBeDefined();
      expect(room?.bankId).toBe(1);
      expect(room?.creatorId).toBe(10);
      expect(room?.questionCount).toBe(2);
    });
  });

  describe('addUser', () => {
    it('should add user to room', async () => {
      mockFindQuestions.mockResolvedValue([]);

      const roomId = await roomService.createRoom(1, 1);

      roomService.addUser(roomId, 5);

      const room = roomService.getRoom(roomId);

      expect(room?.users.length).toBe(1);
      expect(room?.users[0].id).toBe(5);
    });

    it('should not duplicate users', async () => {
      mockFindQuestions.mockResolvedValue([]);

      const roomId = await roomService.createRoom(1, 1);

      roomService.addUser(roomId, 5);
      roomService.addUser(roomId, 5);

      const room = roomService.getRoom(roomId);

      expect(room?.users.length).toBe(1);
    });
  });

  describe('vote and isEveryoneVoted', () => {
    it('should detect when everyone voted', async () => {
      mockFindQuestions.mockResolvedValue([{ id: 1 }]);

      const roomId = await roomService.createRoom(1, 1);

      roomService.addUser(roomId, 10);
      roomService.addUser(roomId, 20);

      roomService.vote(roomId, 10, 1, true);
      expect(roomService.isEveryoneVoted(roomId)).toBe(false);

      roomService.vote(roomId, 20, 1, true);
      expect(roomService.isEveryoneVoted(roomId)).toBe(true);
    });
  });

  describe('saveVotes', () => {
    it('should transform votes correctly', async () => {
      mockFindQuestions.mockResolvedValue([{ id: 1 }]);

      const roomId = await roomService.createRoom(1, 1);

      roomService.addUser(roomId, 10);
      roomService.vote(roomId, 10, 1, true);

      mockCreateVoteData.mockResolvedValue(true);

      await roomService.saveVotes(roomId);

      expect(mockCreateVoteData).toHaveBeenCalledWith(
        expect.objectContaining({
          bankId: 1,
          creatorId: 1,
          answers: [
            {
              userId: 10,
              questionId: 1,
              answer: true,
            },
          ],
        }),
      );
    });
  });
  
});