import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Layout } from "app/components/common/layout";
import { prisma } from "app/server/db/client";

type SubmissionPageProps = {
  submission: {
    id: string;
    quiz: {
      id: string;
      title: string;
      questions: {
        id: string;
        text: string;
        answers: {
          id: string;
          text: string;
          correct: boolean;
        }[];
      }[];
    };
  };
};


export default function SubmissionPage({ submission }: SubmissionPageProps) {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [flashAnswer, setFlashAnswer] = useState(false);
  const [flashAnswerCount, setFlashAnswerCount] = useState(0);

  useEffect(() => {
    // Função para tratar a visibilidade da página
    const handleVisibilityChange = () => {
      if (document.hidden && document.URL !== "http://localhost:3000") {
        // Se a aba estiver oculta e a URL não for localhost, redirecione para a página de pontuação
        router.push(`/submission/${submission.id}/score`);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, submission.id]);

  function nextQuestion() {
    if (currentQuestionIndex === submission.quiz.questions.length - 1) {
      // TODO: salvar submissões no banco de dados

      router.push(`/submission/${submission.id}/score`);
      return;
    }

    // Define o estado flashAnswer
    setFlashAnswer(true);
    // Remove a classe de animação após 1 segundo

    if (flashAnswer) {
      setFlashAnswerCount(flashAnswerCount + 1);
    }
    setTimeout(() => {
      setFlashAnswer(false);
      setSelectedAnswerIndex(-1);
      setCurrentQuestionIndex((currentQuestionIndex) => currentQuestionIndex + 1);
    }, 1000);
  }

  return (
    <Layout pageTitle={submission.quiz.title}>
      <div className="flex-1">
        <header className="mt-12">
          <h1 className="text-slate-800 text-2xl font-bold">
            {submission.quiz.title}
          </h1>
          <div className="flex items-center justify-between">
            <h2 className="text-slate-500 font-semibold text-xl">{`Questão ${currentQuestionIndex + 1
              } de ${submission.quiz.questions.length}`}</h2>
            <span className="text-slate-500 font-semibold text-xl animate-pulse">
              15:00
            </span>
          </div>
        </header>
        <main className="mt-12 flex flex-col">
          <p className="text-slate-800 text-lg font-semibold">
            {submission.quiz.questions[currentQuestionIndex].text}
          </p>
          <div className="flex flex-col gap-1 mt-12">
            {submission.quiz.questions[currentQuestionIndex].answers.map(
              (answer, index) => (
                <button
  key={answer.id}
  className={`p-4 font-semibold rounded text-left transition-colors break-words ${
    selectedAnswerIndex === index
      ? answer.correct // Suponha que haja uma propriedade isCorrect na resposta
        ? "bg-green-400 text-white animate-flash"
        : "bg-red-400 text-white animate-flash"
      : "bg-slate-200 text-slate-800 hover:bg-slate-300"
  }`}
  onClick={() => {
    setSelectedAnswerIndex(index);
    nextQuestion();
  }}
>
  {answer.text}
</button>
              )
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<SubmissionPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const submission = await prisma.submission.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      quiz: {
        select: {
          id: true,
          title: true,
          questions: {
            select: {
              id: true,
              text: true,
              answers: {
                select: {
                  id: true,
                  text: true,
                  correct: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!submission) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      submission,
    },
  };
};

export const flashAnswerCount = 0;
export function setFlashAnswer(arg0: boolean) {
  throw new Error("Function not implemented.");
}