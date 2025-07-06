// frontend/src/components/miscellaneous/ProfileModal.jsx

import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
// Import the centralized upload function
import { updateUserProfile, uploadToCloudinary } from '../../services/api';
import ReusableModal from './ReusableModal';

const ProfileModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { user, setUser } = ChatState();

  const handleShow = () => {
    if(!user) return;
    setName(user.name);
    setPic(user.pic);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  const handleImageUpload = async (file) => {
    setUploading(true);
    if (file === undefined) {
      toast.error("Please select an image!");
      setUploading(false);
      return;
    }
    // We can still check for image type here for a better UX, even if Cloudinary handles it.
    if (file.type === "image/jpeg" || file.type === "image/png") {
      try {
        // Use the centralized and corrected upload function
        const { url } = await uploadToCloudinary(file);
        setPic(url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Error uploading image.");
      }
    } else {
      toast.error("Please select a JPEG or PNG image for your profile.");
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await updateUserProfile({ name, pic }, user.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success("Profile updated successfully!");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile.");
    }
    setLoading(false);
  };

  return (
    <>
      <div onClick={handleShow}>{children}</div>

      <ReusableModal
        isOpen={isOpen}
        onClose={handleClose}
        title={`${user?.name}'s Profile`}
        footer={
          <button onClick={handleSubmit} disabled={loading || uploading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        }
      >
        <div className="flex flex-col items-center space-y-4">
          <img src={pic} alt={user?.name} className="w-36 h-36 rounded-full object-cover shadow-md" />
          <h4 className="text-lg text-gray-500">{user?.email}</h4>
          
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-700">Update Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-700">Update Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-xs text-blue-600">Uploading image...</p>}
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default ProfileModal;