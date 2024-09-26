'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Dynamically import the component that uses useSearchParams
const ArticleEditor = dynamic(() => import('@/components/ArticleEditor'), {
  ssr: false,
});

export default function ArticleEditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setError('Failed to authenticate. Please try again.');
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) return <div className="container mx-auto p-4">加载中...</div>;
  if (error) return <div className="container mx-auto p-4">出错了: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑文章</h1>
      <Suspense fallback={<div>加载编辑器</div>}>
        <ArticleEditor />
      </Suspense>
    </div>
  );
}
