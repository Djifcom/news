import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DateComponent({ dateString }: { dateString: string }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), "EEEE d MMMM yyyy", { locale: fr })}
    </time>
  );
}
