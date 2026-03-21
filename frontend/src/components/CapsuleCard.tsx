import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface CapsuleCardPropType {
  id: string;
  title: string;
  unlockAt: string;
  createdAt: string;
  status: string;
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export default function CapsuleCard({
  id,
  title,
  status,
  unlockAt,
}: CapsuleCardPropType) {
  let badgeColor = "bg-yellow-400";
  if (status === "SENT") {
    badgeColor = "bg-red-500";
  } else if (status === "PROCESSING") {
    badgeColor = "bg-green-500";
  }
  return (
    <Link to={`/capsules/${id}`}>
      <Card className="transform cursor-pointer p-4 transition-all hover:-translate-y-2 hover:shadow-mist-800">
        <CardHeader className="flex justify-between px-0 sm:px-6">
          <CardTitle className="text-md font-extrabold">{title}</CardTitle>
          <Badge variant={"destructive"} className={badgeColor}>
            {status}
          </Badge>
        </CardHeader>
        <CardFooter className="flex justify-between px-0 sm:px-6">
          <Badge variant={"secondary"}>
            Unlock At:<p className="ml-2 font-bold underline">{unlockAt}</p>
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
