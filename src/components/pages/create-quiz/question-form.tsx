import { Trash } from "phosphor-react";
import { KeyboardEvent, useRef, useState } from "react";

import { useQuestionManagement } from "app/context/question-management-context";

type QuestionFormProps = {
  updatingQuestionWithIndex: number | undefined;
  onQuestionSaved: () => void;
  onCancel: () => void;
};

const MIN_QUESTION_ANSWERS = 2;
const NO_ANSWER_SELECTED = -1;

export function QuestionForm({
  updatingQuestionWithIndex,
  onQuestionSaved,
  onCancel,
}: QuestionFormProps) {
  const { questions, addQuestion, updateQuestion } = useQuestionManagement();

  const [text, setText] = useState(() => {
    return updatingQuestionWithIndex !== undefined
      ? questions[updatingQuestionWithIndex].text
      : "";
  });

  const [answers, setAnswers] = useState(() => {
    return updatingQuestionWithIndex !== undefined
      ? questions[updatingQuestionWithIndex].answers
      : [];
  });

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(() => {
    return updatingQuestionWithIndex !== undefined
      ? questions[updatingQuestionWithIndex].correctAnswerIndex
      : NO_ANSWER_SELECTED;
  });

  const answerInputRef = useRef<HTMLTextAreaElement>(null);

  function deleteAnswer(index: number) {
    setAnswers((answers) => answers.filter((_, i) => i !== index));

    if (correctAnswerIndex == index) {
      setCorrectAnswerIndex(NO_ANSWER_SELECTED);
    } else if (correctAnswerIndex > index) {
      setCorrectAnswerIndex((correctAnswerIndex) => correctAnswerIndex - 1);
    }
  }

  function handleSaveQuestion() {
    if (updatingQuestionWithIndex !== undefined) {
      updateQuestion(updatingQuestionWithIndex, {
        text,
        answers,
        correctAnswerIndex,
      });
    } else {
      addQuestion({
        text,
        answers,
        correctAnswerIndex,
      });
    }

    onQuestionSaved();
  }

  function onAnswerInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      const answer = answerInputRef.current!;
      if (answer.value.length > 0) {
        if (
          !answers.some(
            (ans) => ans.toLowerCase() === answer.value.toLowerCase()
          )
        ) {
          const ans = answer.value;
          setAnswers((answers) => [...answers, ans]);
        }

        answer.value = "";
      }
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex flex-col px-4 pt-4 pb-8">
          {updatingQuestionWithIndex === undefined ? (
            <>
              <h1 className="text slate-700 text-lg font-bold">
                Add nova questão
              </h1>
              <p className="text-slate-600 font-medium leading-3">
                Crie quantos respostas você quiser
              </p>
            </>
          ) : (
            <>
              <h1 className="text slate-700 text-lg font-bold">
                Editar questão
              </h1>
              <p className="text-slate-600 font-medium leading-3">
                Fazer mudanças nas suas questões
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1">
            <span className="text-slate-800 font-semibold">Sua questão</span>
            <textarea
              rows={1}
              className="text-sm border border-slate-300 rounded resize-y"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-slate-800 font-semibold">
              Resposta
            </span>
            <span className="text-slate-500 text-sm font-semibold">
              {
                "Aperte ENTER assim que tiver escrito sua resposta"
              }
            </span>
            <textarea
              rows={1}
              className="mt-1 text-sm border border-slate-300 rounded resize-y"
              ref={answerInputRef}
              onKeyDown={onAnswerInputKeyDown}
            />
          </div>
        </div>

        {answers.length === 0 ? (
          <div className="flex px-4 mt-8">
            <span className="bg-slate-100 text-slate-600 font-medium text-center py-4 flex-1">
              {"Crie respostas para sua pergunta"}
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col mt-8 px-4">
              <span className="text-slate-500 text-sm font-semibold">
                Click na resposta para marca-la como correta
              </span>
              <span className="text-slate-500 text-sm font-semibold">
                {
                  "Não se preocupe com a ordem, tudo será embaralhado"
                }
              </span>
            </div>

            {/* answers */}
            <div className="flex flex-col gap-1 p-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between gap-2 transition-colors ${
                    correctAnswerIndex !== index
                      ? "bg-slate-200 text-slate-800"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <button
                    type="button"
                    className="flex-1 text-left min-w-0 break-words p-2 font-medium"
                    onClick={() => setCorrectAnswerIndex(index)}
                  >
                    {answer}
                  </button>
                  <button
                    type="button"
                    className={`mt-2 mr-2 transition-colors ${
                      correctAnswerIndex === index
                        ? "hover:text-green-900"
                        : "hover:text-red-800"
                    }`}
                    onClick={() => deleteAnswer(index)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex p-4 justify-end gap-2 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-red-700 text-white text-sm font-bold rounded hover:bg-red-900 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-800 disabled:bg-slate-400 transition-colors"
          disabled={
            text.trimStart().length === 0 ||
            answers.length < MIN_QUESTION_ANSWERS ||
            correctAnswerIndex == NO_ANSWER_SELECTED
          }
          onClick={handleSaveQuestion}
        >
          {updatingQuestionWithIndex === undefined
            ? "Create question"
            : "Save changes"}
        </button>
      </div>
    </>
  );
}
