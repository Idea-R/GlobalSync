import { useState } from 'react';
import { PersonalInfo } from '../../../types';

export const useTitleEditor = (
  personalInfo: PersonalInfo,
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void
) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(personalInfo.title || '');

  const handleTitleEdit = () => {
    if (editingTitle) {
      const trimmedTitle = tempTitle.trim();
      onUpdatePersonalInfo({ title: trimmedTitle });
      setEditingTitle(false);
    } else {
      setTempTitle(personalInfo.title || '');
      setEditingTitle(true);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleEdit();
    } else if (e.key === 'Escape') {
      setTempTitle(personalInfo.title || '');
      setEditingTitle(false);
    }
  };

  return {
    editingTitle,
    tempTitle,
    setTempTitle,
    handleTitleEdit,
    handleTitleKeyPress,
  };
}; 