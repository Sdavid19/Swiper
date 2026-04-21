import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionDto } from "../shared/types/generated";

interface UpdateQuestionImagePayload {
  id: number;
  imageUrl: string;
}

const questionsSlice = createSlice({
  name: 'questions',
  initialState: [] as QuestionDto[],
  reducers: {
    setQuestions: (_, action: PayloadAction<QuestionDto[]>) => action.payload,

    addQuestionAction: (state, action: PayloadAction<QuestionDto>) => {
      state.unshift(action.payload);
    },

    removeQuestionAction: (state, action: PayloadAction<number>) => {
      return state.filter(b => b.id !== action.payload);
    },

    updateQuestionAction: (state, action: PayloadAction<QuestionDto>) => {
      const index = state.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },

    updateQuestionImageAction: (state, action: PayloadAction<UpdateQuestionImagePayload>) => {
      const question = state.find(q => q.id === action.payload.id);
      if (question) {
        question.imageUrl = action.payload.imageUrl;
      }
    }
  }
});

export default questionsSlice.reducer;
export const {
  setQuestions,
  addQuestionAction,
  removeQuestionAction,
  updateQuestionAction,
  updateQuestionImageAction
} = questionsSlice.actions;