import { Leap } from "@leap-ai/workflows";

const leap = new Leap({
  apiKey: process.env.LEAP_API_KEY as string,
});

export async function POST(req: Request) {
  const { workflowRunId } = await req.json();

  const response = await leap.workflowRuns.getWorkflowRun({
    workflowRunId,
  });

  return new Response(JSON.stringify(response.data));
}
