import { useState } from 'react';
import { AppData } from '../../../types';
import { generateAppShareString, copyToClipboard, parseAppShareString } from '../../../utils/shareString';

export const useDataImportExport = (
  appData: AppData,
  onImportAllAppData: (data: AppData) => void
) => {
  const [appCopySuccess, setAppCopySuccess] = useState(false);
  const [importString, setImportString] = useState('');
  const [importError, setImportError] = useState('');

  const handleExportAllData = async () => {
    const appShareString = generateAppShareString(appData);
    const success = await copyToClipboard(appShareString);
    
    if (success) {
      setAppCopySuccess(true);
      setTimeout(() => setAppCopySuccess(false), 2000);
    }
  };

  const handleImportAllData = () => {
    if (!importString.trim()) {
      setImportError('Please enter an app share string');
      return;
    }

    const parsedData = parseAppShareString(importString.trim());
    if (!parsedData) {
      setImportError('Invalid app share string format. Please check and try again.');
      return;
    }

    onImportAllAppData(parsedData);
    setImportString('');
    setImportError('');
  };

  const clearImportError = () => setImportError('');

  return {
    // State
    appCopySuccess,
    importString,
    importError,
    
    // Actions
    handleExportAllData,
    handleImportAllData,
    setImportString,
    clearImportError,
  };
}; 