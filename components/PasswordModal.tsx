
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';

interface PasswordModalProps {
  onSuccess: () => void;
  onBack: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this should be a secure check.
    if (password === 'risk') {
      login();
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95 animate-scale-in">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Access Restricted</h2>
        <p className="text-center text-gray-400 mb-6">Please enter the password to view documents.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            aria-label="Password for documents"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 px-4 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            Unlock
          </button>
        </form>
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 text-center text-sm text-gray-400 hover:text-white transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;
