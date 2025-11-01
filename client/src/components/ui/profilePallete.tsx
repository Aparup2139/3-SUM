import React from "react";
import { X } from "lucide-react";

interface ProfileImageData {
  id: number;
  url: string;
}

const ProfilePalette: React.FC<{
  data: ProfileImageData[];
  onClose?: () => void;
  handleProfilePicChange: (id: number) => void;
}> = ({ data, onClose, handleProfilePicChange }) => {
  return (
    <div className="absolute top-32 left-24 z-50 w-64 bg-background/95 backdrop-blur-sm p-5 rounded-lg border border-foreground/10 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-foreground/5 rounded-md transition-colors"
          >
            <X size={16} className="text-foreground/60" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((item) => (
          <div
            key={item.id}
            className="aspect-square rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all hover:scale-105"
            onClick={() => handleProfilePicChange(item.id)}
          >
            <img
              src={item.url}
              alt={`Palette ${item.id}`}
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePalette;
