import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostList from './pages/PostList';
import PostDetail from './components/PostDetail';




export default function App() {
  return (
    <>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">MERN Blog</h1>
      <p className="mb-4">A simple blog application built with the MERN stack.</p>

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/:id/edit" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="*" element={<div className="text-red-500">Page not found</div>} />
      </Routes>
      

    </div>
    </>
  );
}