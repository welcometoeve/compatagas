import { MutableRefObject } from "react";

export interface SelectedQuestion {
    quizId: number;
    questionId: number;
    selfId: number;
    answered: boolean;
}
