"use client";

import { Badge } from "./ui/badge";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant="destructive" className="font-normal">
        Missing environment variables. Check .env.local file
      </Badge>
    </div>
  );
}
