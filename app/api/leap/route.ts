import { Leap } from "@leap-ai/workflows";

export async function POST(req: Request) {
  const json = await req.json();
  const { url, painPoints } = json;

  console.log("### url", url);
  console.log("### painPoints", painPoints);

  const leap = new Leap({
    apiKey: process.env.LEAP_API_KEY as string,
  });

  const response = await leap.workflowRuns.workflow({
    workflow_id: "wkf_V0bVVBLlkDceWi",
    input: {
      url,
      pain_points: painPoints
        ? painPoints
        : "We need to incorporate AI for greater operational efficiencies.",
    },
  });
  console.log("### response.data", response.data);

  let status = response.data.status;
  while (status !== "completed") {
    const statusCheck = await leap.workflowRuns.getWorkflowRun({
      workflowRunId: response.data.id,
    });
    status = statusCheck.data.status;

    console.log("### status", status);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before checking again
  }

  const result = await leap.workflowRuns.getWorkflowRun({
    workflowRunId: response.data.id,
  });
  console.log("### result.data", result.data);

  return new Response(JSON.stringify(result.data));
}
