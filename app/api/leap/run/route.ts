import { Leap } from "@leap-ai/workflows";

const leap = new Leap({
  apiKey: process.env.LEAP_API_KEY as string,
});

export async function POST(req: Request) {
  const { url, painPoints } = await req.json();

  console.log("### url", url);
  console.log("### painPoints", painPoints);

  const response = await leap.workflowRuns.workflow({
    workflow_id: "wkf_LTnKcmEfE06llV",
    input: {
      url,
      pain_points: painPoints
        ? painPoints
        : "We need to incorporate AI for greater operational efficiencies.",
    },
  });
  console.log("### response.data", response.data);

  return new Response(JSON.stringify(response.data));
}
