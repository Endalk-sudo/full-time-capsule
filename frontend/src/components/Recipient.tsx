import React from "react";
import { Mail } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface RecipientPropType {
  email: string;
}

const Recipient = ({ email }: RecipientPropType) => {
  return (
    <div className="hover:shadow-accent-foreground flex max-w-2xs cursor-pointer items-center justify-start gap-3 rounded-xl p-2 shadow transition-shadow duration-300">
      <ChevronRight size={20} />
      <Mail size={20} />
      <p>{email}</p>
    </div>
  );
};

export default Recipient;
