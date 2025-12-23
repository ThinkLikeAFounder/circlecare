'use client';

import { useState } from 'react';
import { useStacks } from '@/lib/StacksProvider';
import { useUserCircles, useCreateCircle } from '@/lib/hooks/useCircles';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, DollarSign, TrendingUp, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, isLoading: walletLoading, userAddress } = useStacks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [nickname, setNickname] = useState('');

  // Fetch user's circles
  const { data: circles = [], isLoading: circlesLoading, error: circlesError } = useUserCircles();

  // Create circle mutation
  const createCircleMutation = useCreateCircle();

  if (walletLoading || circlesLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Connect Your Wallet
        </h1>
        <p className="text-white/60 mb-8">
          Please connect your Stacks wallet to view your circles
        </p>
      </div>
    );
  }

  if (circlesError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">
          Error Loading Circles
        </h1>
        <p className="text-white/60 mb-8">
          {circlesError instanceof Error ? circlesError.message : 'Failed to load circles'}
        </p>
      </div>
    );
  }

  const handleCreateCircle = async () => {
    if (!circleName || !nickname) return;

    try {
      await createCircleMutation.mutateAsync({
        name: circleName,
        nickname: nickname,
      });

      // Close modal and reset form on success
      setIsCreateModalOpen(false);
      setCircleName('');
      setNickname('');
    } catch (error) {
      console.error('Failed to create circle:', error);
      // Error is already handled by the mutation
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Your Circles
          </h1>
          <p className="text-white/60">
            Manage your care communities
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Circle
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Active Circles"
          value={circles?.length || 0}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Total Contributed"
          value="Coming Soon"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Settlements"
          value="Coming Soon"
        />
      </div>

      {/* Circles Grid */}
      {circles && circles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circleId: number) => (
            <CircleCard
              key={circleId}
              circleId={circleId}
              onClick={() => router.push(`/circles/${circleId}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
      )}

      {/* Create Circle Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Circle"
      >
        <div className="space-y-4">
          <Input
            label="Circle Name"
            placeholder="Family Circle, Friends Group..."
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
          />
          <Input
            label="Your Nickname"
            placeholder="How should others see you?"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCircle}
              isLoading={createCircleMutation.isPending}
              disabled={!circleName || !nickname || createCircleMutation.isPending}
              className="flex-1"
            >
              Create Circle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ icon, label, value }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-500/20 rounded-xl text-primary-400">
          {icon}
        </div>
        <div>
          <p className="text-white/60 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function CircleCard({ circleId, onClick }: {
  circleId: number;
  onClick: () => void;
}) {
  return (
    <Card hover glow onClick={onClick} className="cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">
          Circle #{circleId}
        </h3>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="space-y-2 text-sm text-white/60">
        <p>Members: 0</p>
        <p>Created: {new Date().toLocaleDateString()}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <Button variant="ghost" className="w-full">
          View Details →
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="mb-6">
        <Circle className="w-20 h-20 text-primary-500/50 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        No Circles Yet
      </h2>
      <p className="text-white/60 mb-6">
        Create your first circle to start sharing care
      </p>
      <Button onClick={onCreateClick}>
        <Plus className="w-5 h-5 mr-2" />
        Create Your First Circle
      </Button>
    </div>
  );
}
