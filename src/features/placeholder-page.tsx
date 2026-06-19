import { Card } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: number;
}

export function PlaceholderPage({
  title,
  description,
  phase,
}: PlaceholderPageProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <Card>
        <p className="text-sm text-muted-foreground">
          Coming in Phase {phase}.
        </p>
      </Card>
    </div>
  );
}
