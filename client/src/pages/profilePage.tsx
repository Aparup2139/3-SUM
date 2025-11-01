import { useState } from "react";
import {
  User,
  Mail,
  Edit2,
  LogOut,
  Trash2,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    instagram: "@johndoe",
    twitter: "@johndoe",
    youtube: "@johndoechannel",
    linkedin: "johndoe",
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="flex bg-background w-full h-full overflow-auto">
      <div className="flex-1 bg-background">
        <div className="border-b px-6 py-4 max-md:hidden">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            Profile
          </h1>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-6 pb-6 border-b">
            <div className="flex flex-col items-center justify-center lg:min-w-[240px]">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center">
                  <User
                    size={48}
                    className="text-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-background rounded-full shadow-lg hover:bg-background/80 cursor-pointer border border-foreground/10">
                  <Edit2 size={12} className="text-foreground" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1.5">
                {profile.name}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <Mail size={14} />
                {profile.email}
              </p>
            </div>

            <div className="flex-1">
              <div className="bg-background/80 rounded-lg p-5 border border-foreground/10">
                <div className="w-full flex justify-between items-start mb-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Personal Information
                  </h3>
                  <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-md transition-colors font-medium cursor-pointer text-sm"
                  >
                    {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-foreground/80 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-foreground/80 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-background/80 rounded-lg p-5 mb-5 border border-foreground/10">
              <h3 className="text-base font-semibold text-foreground mb-3">
                Social Media
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-md p-1.5 flex-shrink-0">
                    <Instagram size={18} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Instagram handle"
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-500 rounded-md p-1.5 flex-shrink-0">
                    <Twitter size={18} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Twitter handle"
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-red-600 rounded-md p-1.5 flex-shrink-0">
                    <Youtube size={18} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={profile.youtube}
                    onChange={(e) => handleChange("youtube", e.target.value)}
                    disabled={!isEditing}
                    placeholder="YouTube channel"
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-700 rounded-md p-1.5 flex-shrink-0">
                    <Linkedin size={18} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    disabled={!isEditing}
                    placeholder="LinkedIn profile"
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-5 py-2.5 rounded-md transition-colors cursor-pointer text-sm">
                <LogOut size={18} />
                Logout
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-5 py-2.5 rounded-md transition-colors cursor-pointer text-sm">
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
