import { useState, useEffect } from 'react';
import { PersonalInfo } from '../../../types';

export const useNameEditor = (
  personalInfo: PersonalInfo,
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void
) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(personalInfo.name);

  // Sync tempName with personalInfo.name when it changes
  useEffect(() => {
    setTempName(personalInfo.name);
  }, [personalInfo.name]);

  const handleNameEdit = () => {
    if (editingName) {
      onUpdatePersonalInfo({ name: tempName.trim() });
    }
    setEditingName(!editingName);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEdit();
    }
    if (e.key === 'Escape') {
      setTempName(personalInfo.name);
      setEditingName(false);
    }
  };

  const cancelNameEdit = () => {
    setTempName(personalInfo.name);
    setEditingName(false);
  };

  return {
    // State
    editingName,
    tempName,
    
    // Actions
    setTempName,
    handleNameEdit,
    handleNameKeyPress,
    cancelNameEdit,
  };
}; 