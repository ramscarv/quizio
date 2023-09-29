import { Layout } from "app/components/common/layout";
import { flashAnswerCount } from "../[id]/index";

export default function SubmissionScorePage() {
  return (
    <Layout pageTitle={`Submission score`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        Pontuação: {flashAnswerCount}
      </div>
    </Layout>
  );
}
