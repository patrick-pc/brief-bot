"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import { useChat } from "ai/react";
import { Message } from "ai";

export default function Home() {
  const [url, setUrl] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [report, setReport] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    onFinish: async (message: Message) => {
      console.log("@@@ message", message);
      await saveToNotion(message.content);
    },
  });

  const generateReport = async () => {
    setLoading(true);
    const response = await fetch("/api/leap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        painPoints: painPoints,
      }),
    });

    const data = await response.json();
    console.log(data);
    setReport({
      images: data.output.images,
      siteData: data.output.site_data,
      newsResults: data.output.news_results,
      company: data.output.company,
    });

    console.log("report", report);

    append({
      role: "user",
      content: `Client Data (Scraped Website Data):
${data.output.site_data}

Client News results:
${JSON.stringify(data.output.news_results)}

Client Pain Points:
${painPoints}
`,
    });

    setLoading(false);

    // await saveToNotion(data.output);
  };

  const saveToNotion = async (brief: any) => {
    console.log("@@@ report", report);

    const response = await fetch("/api/notion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: report.company,
        images: report.images,
        briefBot: brief,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b-[0.5px] border-zinc-800 shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
        <div className="flex items-center">
          <Link
            href="https://www.signalandcipher.com/"
            target="_blank"
            rel="nofollow"
          >
            <Image
              src="https://framerusercontent.com/images/JGs8WFixcVVZert7GnE0iXO9CI.svg"
              alt="Signal & Cipher"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Link
            href="https://patrickpc.notion.site/patrickpc/Project-Discovery-Brief-c723de3f882149648e09cd67bb16511c"
            target="_blank"
            rel="nofollow"
          >
            <div className="text-sm w-48 text-right underline flex items-center justify-center gap-1">
              Notion Page
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-between px-6 py-24">
        <div className="w-full max-w-xl flex flex-col items-center justify-center gap-4">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-zinc-800 border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-zinc-800 border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Pain Points"
            value={painPoints}
            onChange={(event) => setPainPoints(event.target.value)}
          />

          <button
            className="flex h-9 w-full rounded-md bg-zinc-700 items-center justify-center text-zinc-100 font-medium disabled:bg-zinc-800 disabled:cursor-not-allowed"
            onClick={generateReport}
            disabled={loading || !url}
          >
            {loading ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#fff"
              >
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="2">
                    <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
            ) : (
              "Generate Brief"
            )}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 pt-16">
          {report.images && (
            <img
              src={report.images}
              alt="Company Logo"
              className="h-80 object-cover rounded-md"
            />
          )}

          {messages &&
            messages.slice(1).map((m) => (
              <div className="w-full max-w-4xl" key={m.id}>
                <ReactMarkdown className="space-y-6 break-words">
                  {m.content}
                </ReactMarkdown>

                <button
                  onClick={async () => {
                    await saveToNotion(messages[0].content);
                  }}
                >
                  Save To Notion
                </button>
              </div>
            ))}

          {/* <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="text-black"
              value={input}
              onChange={handleInputChange}
            />
            <button type="submit">Send</button>
          </form> */}
        </div>
      </main>
    </>
  );
}
