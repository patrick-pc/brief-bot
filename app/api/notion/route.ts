import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(req: Request) {
  const { images, company, briefBot } = await req.json();

  console.log("### images", images);
  console.log("### company", company);
  console.log("### briefBot", briefBot);

  const response = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: "c723de3f882149648e09cd67bb16511c",
    },
    properties: {
      title: [
        {
          text: {
            content: company,
          },
        },
      ],
    },
    children: [
      {
        object: "block",
        image: {
          type: "external",
          external: {
            url: images,
          },
        },
      },
      {
        object: "block",
        heading_2: {
          rich_text: [
            {
              text: {
                content: "Brief Bot",
              },
            },
          ],
        },
      },
      {
        object: "block",
        paragraph: {
          rich_text: [
            {
              text: {
                content: briefBot.slice(0, 2000),
              },
            },
          ],
        },
      },
    ],
  });
  console.log(response);

  return new Response(JSON.stringify(response));
}
