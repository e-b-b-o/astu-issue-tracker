import React from 'react';
import { Search, Filter } from 'lucide-react';
import { STATUSES } from '../../utils/constants';
import './SearchFilter.css';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  hideStatus = false
}) => {
  return (
    <div className="search-filter-container fade-in">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filters-group">
        <div className="filter-item">
          <Filter size={16} className="filter-icon" />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Categories</option>
            <option value="ACADEMIC">Academic</option>
            <option value="HOSTEL">Hostel</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="CAFETERIA">Cafeteria</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {!hideStatus && (
          <div className="filter-item">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value={STATUSES.OPEN}>Open</option>
              <option value={STATUSES.IN_PROGRESS}>In Progress</option>
              <option value={STATUSES.RESOLVED}>Resolved</option>
            </select>
          </div>
        )}

        <div className="filter-item">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select sort-select"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
