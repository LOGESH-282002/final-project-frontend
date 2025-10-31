'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function ProfilePage() {
  const { user, loading, updateProfile, uploadAvatar } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || ''
      });
      setPreviewUrl(user.avatar || '');
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setUploadLoading(true);
    setError('');

    try {
      await uploadAvatar(selectedFile);
      setSuccess('Avatar updated successfully!');
      setSelectedFile(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload avatar');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdateLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || ''
    });
    setPreviewUrl(user.avatar || '');
    setSelectedFile(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Profile
                </h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="btn btn-secondary cursor-pointer"
                      >
                        Choose Image
                      </label>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleAvatarUpload}
                          disabled={uploadLoading}
                          className="btn btn-primary"
                        >
                          {uploadLoading ? 'Uploading...' : 'Upload Avatar'}
                        </button>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Max file size: 5MB. Supported: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input opacity-60 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="btn btn-primary flex-1"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Member since:</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}