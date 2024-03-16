"use client";

import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import styles from './Settings.module.css';
import { backend_url } from "@/app/settings";
import { useRouter } from 'next/navigation';
import { FaUpload } from "react-icons/fa";


const getUser = async () => {
  try {
    const response = await fetch(backend_url("/user/"), { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

const setName = async (oldName: String, newName: String) => {
  try {
    const response = await fetch(backend_url(`/user/name/${newName}`), {
      method: 'POST', // Specifies this is a POST request
      credentials: 'include', // Keeps the credentials include as before
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update user name:", error);
    return null;
  }
};


export default function Home() {
  const [username, setUsername] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [avatarImg, setAvatarImg] = useState<File | null>();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handles username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username && username.length > 0) {
        const response = await setName(oldUsername, username);
        // await uploadAvatarImg();
        setOldUsername(username);
      }
      if (avatarImg) {
        const formData = new FormData();
        formData.append('image', avatarImg);
        await uploadAvatarImg(formData);
      }
      router.push('/profile');
    } catch (error) {
      console.error("Failed to update user name:", error);
    }
  };

  const uploadAvatarImg = async (formData: FormData) => {
    try {
      const response = await fetch(backend_url('/user/avatar'), {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log('Avatar image uploaded successfully');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      if (userData) {
        setOldUsername(userData.name);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (imgSrc !== null)
      URL.revokeObjectURL(imgSrc);

    if (avatarImg) {
      const url = URL.createObjectURL(avatarImg);
      setImgSrc(url);
      return () => URL.revokeObjectURL(url);
    }

  }, [avatarImg]);

  const onUploadClick = () => {
    photoRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    setAvatarImg(file);
  };

  return (
    <div className={`${styles.container} page-profile`}>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className={styles.fileUploadWrapper} onClick={onUploadClick}>
          {imgSrc && <img className={styles.imgPreview} src={imgSrc} alt={'new-avatar-image-preview'} />}
          <div className={styles.uploadBox}>
            <FaUpload />
            <h4 className='upload-box-header'>Choose Avatar Image to Upload</h4>
            <input type="file" onChange={handleFileChange} className="photo-select" ref={photoRef} hidden accept=".png,.jpg" />
          </div>
        </div>
        <button type="submit" className={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};


