"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <li className="flex flex-col gap-2">
        <h3 className="font-medium">Create a Supabase project</h3>
        <p className="text-sm text-muted-foreground">
          Head over to{" "}
          <Link
            href="https://supabase.com/dashboard"
            target="_blank"
            className="font-bold hover:underline text-foreground"
          >
            database.new
          </Link>{" "}
          to create a new Supabase project.
        </p>
      </li>

      <li className="flex flex-col gap-2">
        <h3 className="font-medium">Retrieve your project credentials</h3>
        <p className="text-sm text-muted-foreground">
          Head to your{" "}
          <Link
            href="https://supabase.com/dashboard/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground"
          >
            project settings
          </Link>{" "}
          and copy the following values:
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Badge variant="secondary">Project URL</Badge>
            <span className="text-sm text-muted-foreground">
              https://[project-ref].supabase.co
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary">Project API Key</Badge>
            <span className="text-sm text-muted-foreground">
              your-anon-key
            </span>
          </div>
        </div>
      </li>

      <li className="flex flex-col gap-2">
        <h3 className="font-medium">Update your environment variables</h3>
        <p className="text-sm text-muted-foreground">
          Create a .env.local file in your project root and add the following variables:
        </p>
        <pre className="bg-secondary p-4 rounded-lg text-sm">
          <code>{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}</code>
        </pre>
      </li>

      <li className="flex flex-col gap-2">
        <h3 className="font-medium">Restart your Next.js development server</h3>
        <p className="text-sm text-muted-foreground">
          Stop your development server and run npm run dev again for the changes to take effect.
        </p>
        <Button asChild variant="default" className="w-fit">
          <Link href="/">Refresh the page</Link>
        </Button>
      </li>
    </ol>
  );
}