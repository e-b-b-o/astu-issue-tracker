import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useUI } from '../../context/UIContext';
import { validateFile } from '../../utils/validators';
import './ComplaintForm.css';

const ComplaintForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const { addToast } = useUI();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setFileError(error);
        setFile(null);
        e.target.value = null; // Reset input
      } else {
        setFileError('');
        setFile(selectedFile);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileError('');
    document.getElementById('file-upload').value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    
    onSubmit({ ...formData, file });
  };

  return (
    <form className="complaint-form fade-in" onSubmit={handleSubmit}>
      <Input
        label="Complaint Title *"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Briefly describe the issue"
        required
      />

      <div className="input-group">
        <label htmlFor="category" className="input-label">Category *</label>
        <select
          id="category"
          name="category"
          className="input-field"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="ACADEMIC">Academic</option>
          <option value="HOSTEL">Hostel / Accommodation</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="CAFETERIA">Cafeteria</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="description" className="input-label">Description *</label>
        <textarea
          id="description"
          name="description"
          className="input-field textarea-field"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide detailed information about the issue..."
          rows={5}
          required
        />
      </div>

      <div className="file-upload-wrapper">
        <label className="input-label">Supporting Document/Image (Optional)</label>
        <p className="file-hint">JPG, PNG, or PDF. Max 5MB.</p>
        
        {!file ? (
          <label htmlFor="file-upload" className={`file-drop-zone ${fileError ? 'error' : ''}`}>
            <UploadCloud size={32} className="upload-icon" />
            <span>Click to upload or drag and drop</span>
            <input
              type="file"
              id="file-upload"
              className="file-input-hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button type="button" className="file-clear-btn" onClick={clearFile} aria-label="Remove file">
              <X size={18} />
            </button>
          </div>
        )}
        {fileError && <span className="error-text">{fileError}</span>}
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </Button>
      </div>
    </form>
  );
};

export default ComplaintForm;
