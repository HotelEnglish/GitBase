'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchArticles = useCallback(async (sync = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles${sync ? '?sync=true' : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchArticles();
  }, [checkAuth, fetchArticles]);

  const handleSync = useCallback(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">文章管理</h1>
      <div className="mb-4 flex justify-between">
        <Link href="/admin">
          <Button>返回仪表盘</Button>
        </Link>
        <div>
          <Button onClick={handleSync} className="mr-2">同步文章/Button>
          <Link href="/admin/articles/create">
            <Button>新建文章</Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>已创建</TableHead>
            <TableHead>上次更改</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={index}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.description}</TableCell>
              <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(article.lastModified).toLocaleString()}</TableCell>
              <TableCell>
                <Link href={`/admin/articles/edit?path=${encodeURIComponent(article.path)}`}>
                  <Button>编辑</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
