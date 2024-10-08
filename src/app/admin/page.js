'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPage() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ name: '', description: '', url: '' });
  const [editingIndex, setEditingIndex] = useState(null);
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
      console.error('检查身份验证时出错:', error);
      setError('身份验证失败，请重试。');
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchResources();
  }, [checkAuth]);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resources?source=github');
      if (!response.ok) {
        throw new Error('获取资源错误');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('获取资源错误:', error);
      setError('获取资源错误，请重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedResources = [...resources];
      updatedResources[index] = { ...updatedResources[index], [name]: value };
      setResources(updatedResources);
    } else {
      setNewResource({ ...newResource, [name]: value });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = async (index) => {
    let updatedResources = [...resources];
    if (index === -1) {
      updatedResources.push(newResource);
      setNewResource({ name: '', description: '', url: '' });
    }
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedResources),
      });
      if (!response.ok) {
        throw new Error('保存资源错误');
      }
      await fetchResources(); // Fetch the latest data after saving
      setEditingIndex(null);
    } catch (error) {
      console.error('保存资源错误:', error);
      setError('保存资源失败，请重试。');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">加载中...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">出错了: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      <div className="mb-4">
        <Link href="/admin/articles">
          <Button>管理文章</Button>
        </Link>
      </div>
      <h2 className="text-xl font-bold mb-4">资源管理</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>链接</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource, index) => (
            <TableRow key={index}>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="name" value={resource.name} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.name
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="description" value={resource.description} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.description
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="url" value={resource.url} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.url
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Button onClick={() => handleSave(index)}>保存</Button>
                ) : (
                  <Button onClick={() => handleEdit(index)}>编辑</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input name="name" value={newResource.name} onChange={handleInputChange} placeholder="新资源名称" />
            </TableCell>
            <TableCell>
              <Input name="description" value={newResource.description} onChange={handleInputChange} placeholder="新资源描述" />
            </TableCell>
            <TableCell>
              <Input name="url" value={newResource.url} onChange={handleInputChange} placeholder="新资源链接" />
            </TableCell>
            <TableCell>
              <Button onClick={() => handleSave(-1)}>新增</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
