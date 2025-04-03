'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Globe, CheckCircle, XCircle, Activity } from 'lucide-react';
import axios from 'axios';
import { AddWebsiteRequest } from '@repo/types/api';
import { API_BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';
import { useWebsites } from '@/hooks/useWebsites';





function App() {
  const { websites, refreshWebsites, isLoading } = useWebsites();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { getToken } = useAuth();

  const handleAddWebsite = async (e: React.FormEvent) => {
    console.log("handling new website");
    e.preventDefault();
    if (newWebsiteUrl) {
      if (websites.find(w => w.url === newWebsiteUrl)) {
        alert("Website already exists")
        return;
      }

      await refreshWebsites();
      const data: Omit<AddWebsiteRequest, "userId"> = {
        url: newWebsiteUrl
      };

      console.log("new website data ", data);
      console.log("url: ", API_BACKEND_URL)

      const token = await getToken();
      console.log("token: ", token);

      await axios.post(`${API_BACKEND_URL}/api/website`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setNewWebsiteUrl('');
      setShowAddForm(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const calculateUptimePercentage = (status: typeof websites[number]['websiteTicks']) => {
    const upCount = status.filter(s => s.status === 'GOOD').length;
    return ((upCount / status.length) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-10 w-10 text-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
              Uptime Monitor
            </span>
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-5 w-5" />
            Add Website
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <form onSubmit={(e) => handleAddWebsite(e)} className="flex gap-4">
              <input
                type="url"
                value={newWebsiteUrl}
                onChange={(e) => setNewWebsiteUrl(e.target.value)}
                placeholder="Enter website URL"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-100 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : websites.map((website) => (
            <div key={website.id} className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/5">
              <button
                onClick={() => toggleExpand(website.id)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Globe className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-medium text-gray-100">{website.url}</span>
                    <span className="text-sm text-emerald-400">
                      {calculateUptimePercentage(website.websiteTicks)}% uptime
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${website.websiteTicks[0]?.status === 'GOOD'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}>
                    {website.websiteTicks[0]?.status === 'GOOD' ? 'Online' : 'Offline'}
                  </span>
                  {expandedId === website.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedId === website.id && (
                <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
                  <h3 className="text-lg font-medium text-gray-200 mb-4">
                    Last 30 Minutes Status
                  </h3>
                  <div className="grid grid-cols-15 gap-2">
                    {website.websiteTicks.map((status, index) => (
                      <div
                        key={index}
                        className="relative group"
                        title={`${new Date(status.timestamp).toLocaleTimeString()}: ${status.status === 'GOOD' ? 'Online' : 'Offline'
                          }`}
                      >
                        {status.status === 'GOOD' ? (
                          <div className="p-1 bg-emerald-500/20 rounded-lg transition-all duration-200 hover:bg-emerald-500/30">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="p-1 bg-red-500/20 rounded-lg transition-all duration-200 hover:bg-red-500/30">
                            <XCircle className="h-5 w-5 text-red-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {!isLoading && websites.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No websites added yet. Click &quot;Add Website&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;