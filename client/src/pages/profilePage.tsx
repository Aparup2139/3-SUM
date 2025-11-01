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
    <div className="flex w-full h-full overflow-auto bg-slate-900">
      <div className="flex-1 bg-slate-900">
        <div className="border-b border-gray-800 px-8 py-6">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Account settings and preferences
          </h1>
        </div>
        <div className="px-8 py-8">
          <div className="flex flex-col items-center mb-12 pb-8 border-b border-gray-800">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center">
                <User size={56} className="text-white" strokeWidth={1.5} />
              </div>
              <button className="absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 rounded-full p-2.5 shadow-lg transition-colors">
                <Edit2 size={14} className="text-white" />
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {profile.name}
            </h2>
            <p className="text-gray-400 flex items-center gap-2 text-sm">
              <Mail size={16} />
              {profile.email}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Edit Profile Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
              >
                <Edit2 size={18} />
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6 mb-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Handles */}
            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6 mb-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Social Media
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg p-2 flex-shrink-0">
                    <Instagram size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Instagram handle"
                    className="flex-1 bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
                    <Twitter size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Twitter handle"
                    className="flex-1 bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-600 rounded-lg p-2 flex-shrink-0">
                    <Youtube size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.youtube}
                    onChange={(e) => handleChange("youtube", e.target.value)}
                    disabled={!isEditing}
                    placeholder="YouTube channel"
                    className="flex-1 bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-700 rounded-lg p-2 flex-shrink-0">
                    <Linkedin size={20} />
                  </div>
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    disabled={!isEditing}
                    placeholder="LinkedIn profile"
                    className="flex-1 bg-gray-900 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700">
                <LogOut size={20} />
                Logout
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 bg-opacity-20 hover:bg-opacity-30 text-red-400 px-6 py-3 rounded-lg transition-colors border border-red-600 border-opacity-30">
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
