import React, { useState } from 'react';

interface BookingFormProps {
  onSubmit: (name: string, email: string) => void;
  buttonText: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, buttonText }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email);
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full h-12 px-4 rounded-lg bg-white-950/30 border-2 border-red-800 text-white placeholder-black-400/70 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500/20 transition-colors"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full h-12 px-4 rounded-lg bg-white-950/30 border-2 border-red-800 text-white placeholder-black-400/70 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500/20 transition-colors"
          placeholder="Enter your email"
        />
      </div>
      <button
        type="submit"
        className="w-full h-12 inline-flex justify-center items-center rounded-lg border-2 border-red-500 px-6 text-base font-medium text-white shadow-sm bg-gradient-to-r from-red-900 to-black hover:from-red-800 hover:to-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02]"
      >
        {buttonText}
      </button>
    </form>
  );
};