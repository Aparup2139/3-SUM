import { toast } from "sonner";

export const showError = (error: unknown, message: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object"
    ) {
        const res = (error as any).response;
        message = res?.data?.message || res?.data?.error || message;
    } else if (error instanceof Error) {
        message = error.message;
    }
    toast.error(message);

}