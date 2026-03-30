import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './Modal';

interface BaseCreateCardProps<T> {
  title: { create: string; edit: string };
  entityName: string;
  initialData: T;
  redirectPath: string;
  onFetch?: (id: number) => Promise<T>;
  onSave: (id: number | null, data: T) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
  onInitialize?: () => Promise<void>;
  submitButtonText?: { create: string; edit: string };
  children: (data: T, setData: React.Dispatch<React.SetStateAction<T>>, isEditMode: boolean) => React.ReactNode;
}

function BaseCreateCard<T>({
  title,
  entityName,
  initialData,
  redirectPath,
  onFetch,
  onSave,
  onDelete,
  onInitialize,
  submitButtonText,
  children
}: BaseCreateCardProps<T>) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    const init = async () => {
      try {
        if (onInitialize) await onInitialize();
        if (isEditMode && id && onFetch) {
          const result = await onFetch(Number(id));
          setData(result);
        }
      } catch (err) {
        console.error(`Error initializing ${entityName}:`, err);
      }
    };
    init();
  }, [id, isEditMode, onFetch, onInitialize, entityName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(isEditMode ? Number(id) : null, data);
      navigate(redirectPath);
    } catch (error) {
      console.error(`Error saving ${entityName}:`, error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ${entityName.toLowerCase()}?`)) {
      try {
        await onDelete(Number(id));
        navigate(redirectPath);
      } catch (error) {
        console.error(`Error deleting ${entityName}:`, error);
      }
    }
  };

  return (
    <Modal isOpen onClose={() => navigate(redirectPath)} title={isEditMode ? title.edit : title.create}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {children(data, setData, isEditMode)}
        <div className="pt-4 flex gap-3">
          {isEditMode && (
            <button 
              type="button" 
              onClick={handleDelete}
              className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <button type="submit" className="flex-1 btn-primary py-4">
            {isEditMode 
              ? (submitButtonText?.edit || `Update ${entityName}`) 
              : (submitButtonText?.create || `Save ${entityName}`)}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default BaseCreateCard;
