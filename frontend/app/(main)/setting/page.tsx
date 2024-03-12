"use client";

import React, { useEffect, useState } from 'react';
import styles from './Settings.module.css';
import { backend_url } from "@/app/settings";
import { useRouter } from 'next/navigation';


export const getUser = async () => {
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

  export const setName = async (oldName: String, newName: String) => {
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
    const router = useRouter(); 
  
    // Handles username change
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };
  
    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await setName(oldUsername, username);
            setOldUsername(username); 
            router.push('/profile');
        } catch (error) {
            console.error("Failed to update user name:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          const userData = await getUser();
          if (userData) {
            setOldUsername(userData.name);
          }
        };
    
        fetchData();
      }, []);
  
    return (
      <div className={styles.container}>
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
          <button type="submit" className={styles.button}>Save Changes</button>
        </form>
      </div>
    );
};


