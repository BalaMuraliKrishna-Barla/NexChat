// frontend/src/components/miscellaneous/ProfileModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../services/api';

const ProfileModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, setUser } = ChatState();

  const handleShow = () => {
    setName(user.name);
    setPic(user.pic);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleImageUpload = async (file) => {
    setLoading(true);
    if (file === undefined) {
      toast.error("Please select an image!");
      setLoading(false);
      return;
    }
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Chat-App"); 
      
      const cloudinaryAPI = "https://api.cloudinary.com/v1_1/dr8gzltrw/image/upload";
      try {
        const res = await fetch(cloudinaryAPI, {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        setPic(result.secure_url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Error uploading image.");
      }
    } else {
      toast.error("Please select a JPEG or PNG image.");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await updateUserProfile({ name, pic }, user.token);
      
      // Update the user info in both context and localStorage
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
      <span onClick={handleShow}>{children}</span>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{user?.name}'s Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={pic} alt={user?.name} roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '20px' }} />
          <h4 className="text-muted">{user?.email}</h4>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Update Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;