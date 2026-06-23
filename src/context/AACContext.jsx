import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { defaultVocabulary } from '../data/defaultVocabulary';

const AACContext = createContext();

export const useAAC = () => useContext(AACContext);

export const AACProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ pitch: 1.1, rate: 0.85, pin: '1234', autoFullscreen: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCats = await localforage.getItem('aac_categories');
        const storedSettings = await localforage.getItem('aac_settings');
        
        if (storedCats && storedCats.length > 0) {
          setCategories(storedCats);
        } else {
          setCategories(defaultVocabulary);
          await localforage.setItem('aac_categories', defaultVocabulary);
        }

        if (storedSettings) {
          setSettings({ autoFullscreen: true, ...storedSettings });
        } else {
          await localforage.setItem('aac_settings', { pitch: 1.1, rate: 0.85, pin: '1234', autoFullscreen: true });
        }
      } catch (err) {
        console.error("Error loading data", err);
        setCategories(defaultVocabulary);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveCategories = async (newCategories) => {
    setCategories(newCategories);
    await localforage.setItem('aac_categories', newCategories);
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await localforage.setItem('aac_settings', newSettings);
  };

  return (
    <AACContext.Provider value={{ categories, saveCategories, settings, saveSettings, loading }}>
      {children}
    </AACContext.Provider>
  );
};
