import { toast } from "sonner";

export function showCustomNotification({ title, body, url }: { title: string; body: string; url?: string }) {
  toast(
    <div className="flex flex-col gap-1 text-sm">
      <strong className="text-base font-medium">{title}</strong>
      <p className="text-zinc-200 whitespace-pre-line">{body}</p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline mt-1"
        >
          Open Notification
        </a>
      )}
    </div>,
    {
      duration: 8000,
    }
  );
}
