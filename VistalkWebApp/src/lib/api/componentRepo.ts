import type { CallResultDto } from "../../types/types";
import { postForm } from "./baseRepo";
import type { QuestionMultipleDto } from "./componentType";

export async function saveQuestionMultipleChoice(question: QuestionMultipleDto) {
    const formData = new FormData();

    formData.append('questionID', String(question.questionID));
    formData.append('questionText', question.questionText);
    formData.append('questionTypeID', String(question.questionTypeID));
    formData.append('unitId', String(question.unitId));
    formData.append('choice1', String(question.choice1));
    formData.append('choice2', String(question.choice2));
    formData.append('choice3', String(question.choice3));
    formData.append('choice4', String(question.choice4));
    formData.append('correctChoice', String(question.correctChoice));

    // Append optional file if present
    if (question.file) {
        formData.append('file', question.file);
    }

    // Append imagePath and audioPath if present
    formData.append('imagePath', question.imagePath || '');
    formData.append('audioPath', question.audioPath || '');

    return await postForm<CallResultDto<object>>(`/saveQuestionMultiple`, formData);
}