'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleEditor() {
  const [article, setArticle] = useState({ title: '', description: '', content: '', path: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const path = searchParams.get('path');

  useEffect(() => {
    if (path) {
      fetchArticle(decodeURIComponent(path));
    } else {
      setError('No article path provided');
      setIsLoading(false);
    }
  }, [path]);

  const fetchArticle = async (articlePath) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles?path=${encodeURIComponent(articlePath)}`);
      if (!response.ok) {
        throw new Error('获取文失败');
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('获取文章出错：', error);
      setError('无法获取文章。请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
      });
      if (!response.ok) {
        throw new Error('保存文章失败');
      }
      alert('保存文章成功');
    } catch (error) {
      console.error('保存文章出错：', error);
      setError('保存文章失败，请重试');
    }
  };

  if (isLoading) return <div>加载文章...</div>;
  if (error) return <div>出错了: {error}</div>;

  return (
    <div className="space-y-4">
      <Input
        name="title"
        value={article.title}
        onChange={handleInputChange}
        placeholder="文章标题"
      />
      <Input
        name="description"
        value={article.description}
        onChange={handleInputChange}
        placeholder="文章描述"
      />
      <Textarea
        name="content"
        value={article.content}
        onChange={handleInputChange}
        placeholder="文章内容"
        rows={20}
      />
      <Button onClick={handleSave}>保存文章</Button>
    </div>
  );
}
