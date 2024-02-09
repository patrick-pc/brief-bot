import { Leap } from "@leap-ai/workflows";

const leap = new Leap({
  apiKey: process.env.LEAP_API_KEY as string,
});

export async function POST(req: Request) {
  const { workflowRunId } = await req.json();

  console.log("### workflowRunId", workflowRunId);

  const response = await leap.workflowRuns.getWorkflowRun({
    workflowRunId,
  });

  console.log("### response.data", response.data);

  return new Response(JSON.stringify(response.data));
}
