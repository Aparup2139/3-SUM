import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { logout } from "@/httpfnc/auth";
import { LogOutIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutBox({ TriggerJsx }: { TriggerJsx: ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/");
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{TriggerJsx}</DialogTrigger>
        <DialogContent className="max-w-60  flex flex-col gap-5 justify-center items-start">
          <DialogHeader className="flex flex-col gap-5 mt-4">
            <DialogTitle>Are you sure you want to Log out ?</DialogTitle>
            <LogOutIcon size={30} />
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              disabled={loading}
              onClick={handleLogout}
              className="bg-primary text-primary-foreground"
              type="submit"
            >
              Logout
            </Button>
            <DialogClose asChild>
              <Button
                disabled={loading}
                className="bg-secondary text-secondary-foreground"
                type="button"
              >
                cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
