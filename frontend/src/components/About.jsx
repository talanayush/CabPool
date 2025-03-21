import React from 'react';
import Navbar from './Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
    <Navbar/>
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">About Our App</h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          Welcome to our app! This application is designed to provide you with an intuitive and seamless experience.
          We strive to make our services both reliable and easy to use.
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">
          Our team is dedicated to continuously improving our app based on your needs and feedback. Whether you're here to explore
          new features or simply learn more about what we do, we're excited to have you with us.
        </p>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">We Value Your Feedback</h2>
        <form action="/submit-feedback" method="POST" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="feedback" className="block text-gray-700 font-medium">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              rows="5"
              placeholder="Your feedback"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutPage;
