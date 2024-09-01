import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function AlertDemo({ title, description }) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
