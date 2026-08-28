import { InfinityLoop } from "@/components/ui/infinity";

export default function Default() {
  return (
    <div className="flex items-center justify-center p-10 text-foreground">
      <InfinityLoop className="h-12 w-20" />
    </div>
  );
}
