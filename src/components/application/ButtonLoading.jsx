import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ButtonLoading = ({
  type,
  text,
  loading,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      {...props}
      className={cn("", className)}
    >
      {loading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
