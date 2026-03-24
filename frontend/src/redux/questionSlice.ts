import { createSlice } from "@reduxjs/toolkit";
import { QuestionDto } from "../shared/types/generated";


const questionsSlice = createSlice({
  name: 'questions',
  initialState: [] as QuestionDto[],
  reducers: {
    setQuestions: (_, action) => action.payload,

    addQuestionAction: (state, action) => {
      state.unshift(action.payload);
    },

    removeQuestionAction: (state, action) => {
      return state.filter(b => b.id !== action.payload);
    },

    updateQuestionAction: (state, action) => {
      const index = state.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    }
  }
});

export default questionsSlice.reducer
export const { setQuestions, addQuestionAction, removeQuestionAction, updateQuestionAction } = questionsSlice.actions