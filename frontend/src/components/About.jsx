import React from 'react';
import Navbar from './Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 py-10 flex flex-col items-center">
      <Navbar />
      <div className="max-w-3xl bg-white p-10 shadow-2xl rounded-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Our App</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to our app! This application is designed to provide you with an intuitive and seamless experience.
          We strive to make our services both reliable and easy to use.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          Our team is dedicated to continuously improving our app based on your needs and feedback. Whether you're here to explore
          new features or simply learn more about what we do, we're excited to have you with us.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">We Value Your Feedback</h2>
        <form action="/submit-feedback" method="POST" className="space-y-6 text-left">
          <div>
            <label htmlFor="name" className="block text-gray-800 font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-800 font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="feedback" className="block text-gray-800 font-medium mb-1">Feedback</label>
            <textarea
              id="feedback"
              name="feedback"
              rows="5"
              placeholder="Your feedback"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutPage;