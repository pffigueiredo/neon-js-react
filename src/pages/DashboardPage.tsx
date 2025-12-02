import {
  RedirectToSignIn,
  SignedIn,
  AuthLoading,
  UserAvatar,
} from '@neondatabase/neon-auth-ui';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthUIContext } from '@neondatabase/neon-auth-ui';
import { neonClient } from '../client';
import type { Tables } from '../../database.types';

type Todo = Tables<'todos'>;
type FilterType = 'all' | 'active' | 'completed';

export function DashboardPage() {
  return (
    <>
      {/* Redirect to sign-in if not authenticated */}
      <RedirectToSignIn />

      {/* Loading state */}
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>

      {/* Dashboard content - only visible when signed in */}
      <SignedIn>
        <DashboardContent />
      </SignedIn>
    </>
  );
}

function DashboardContent() {
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id;

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await neonClient
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTodos(data || []);
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !userId) return;

    setIsAdding(true);
    setError(null);

    try {
      const { data, error: insertError } = await neonClient
        .from('todos')
        .insert({
          title: newTodoTitle.trim(),
          user_id: userId,
          completed: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTodos((prev) => [data, ...prev]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (todo: Todo) => {
    setError(null);

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      const { error: updateError } = await neonClient
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id);

      if (updateError) throw updateError;
    } catch (err) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t
        )
      );
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (todoId: string) => {
    setError(null);

    // Optimistic update
    const previousTodos = todos;
    setTodos((prev) => prev.filter((t) => t.id !== todoId));

    try {
      const { error: deleteError } = await neonClient
        .from('todos')
        .delete()
        .eq('id', todoId);

      if (deleteError) throw deleteError;
    } catch (err) {
      // Revert on error
      setTodos(previousTodos);
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  // Clear completed todos
  const clearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;

    setError(null);
    const previousTodos = todos;
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      const { error: deleteError } = await neonClient
        .from('todos')
        .delete()
        .in('id', completedIds);

      if (deleteError) throw deleteError;
    } catch (err) {
      setTodos(previousTodos);
      setError('Failed to clear completed todos');
      console.error('Error clearing completed:', err);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((t) => !t.completed).length;
  const completedTodosCount = todos.filter((t) => t.completed).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <UserAvatar user={session?.user} style={{ width: 48, height: 48 }} />
          <div>
            <h1 style={styles.welcomeTitle}>
              {session?.user?.name || 'User'}'s Tasks
            </h1>
            <p style={styles.email}>{session?.user?.email}</p>
          </div>
        </div>
        <Link to="/account/settings" style={styles.settingsButton}>
          ⚙️ Settings
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Total Tasks</span>
            <span style={{ fontSize: '1.25rem' }}>📋</span>
          </div>
          <p style={styles.statValue}>{todos.length}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Active</span>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
          </div>
          <p style={styles.statValue}>{activeTodosCount}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Completed</span>
            <span style={{ fontSize: '1.25rem' }}>✅</span>
          </div>
          <p style={styles.statValue}>{completedTodosCount}</p>
        </div>
      </div>

      {/* Main Todo Card */}
      <div style={styles.todoCard}>
        <div style={styles.todoHeader}>
          <h2 style={styles.todoTitle}>📝 My Tasks</h2>
          {completedTodosCount > 0 && (
            <button onClick={clearCompleted} style={styles.clearButton}>
              Clear completed ({completedTodosCount})
            </button>
          )}
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} style={styles.addForm}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="What needs to be done?"
            style={styles.addInput}
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={!newTodoTitle.trim() || isAdding}
            style={{
              ...styles.addButton,
              opacity: !newTodoTitle.trim() || isAdding ? 0.5 : 1,
              cursor:
                !newTodoTitle.trim() || isAdding ? 'not-allowed' : 'pointer',
            }}
          >
            {isAdding ? '...' : '+ Add'}
          </button>
        </form>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterTab,
                backgroundColor:
                  filter === f ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                borderColor:
                  filter === f
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                color:
                  filter === f
                    ? 'rgba(16, 185, 129, 1)'
                    : 'rgba(161, 161, 170, 1)',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${todos.length})`}
              {f === 'active' && ` (${activeTodosCount})`}
              {f === 'completed' && ` (${completedTodosCount})`}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
            <button onClick={() => setError(null)} style={styles.dismissError}>
              ×
            </button>
          </div>
        )}

        {/* Todo List */}
        <div style={styles.todoList}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
              <p>Loading tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div style={styles.emptyState}>
              <span
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              >
                {filter === 'completed'
                  ? '🎉'
                  : filter === 'active'
                    ? '✨'
                    : '📋'}
              </span>
              <p style={styles.emptyTitle}>
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                    ? 'All tasks completed!'
                    : 'No tasks yet'}
              </p>
              <p style={styles.emptySubtitle}>
                {filter === 'completed'
                  ? 'Complete some tasks to see them here'
                  : filter === 'active'
                    ? 'Time to add more tasks'
                    : 'Add a task above to get started'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer with tips */}
      <div style={styles.tipsCard}>
        <h3 style={styles.tipsTitle}>💡 Quick Tips</h3>
        <ul style={styles.tipsList}>
          <li>Click the checkbox to mark a task as complete</li>
          <li>Use filters to focus on active or completed tasks</li>
          <li>Clear completed tasks to keep your list tidy</li>
        </ul>
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.todoItem,
        backgroundColor: isHovered
          ? 'rgba(39, 39, 42, 0.8)'
          : 'rgba(39, 39, 42, 0.5)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onToggle(todo)}
        style={{
          ...styles.checkbox,
          backgroundColor: todo.completed
            ? 'rgba(16, 185, 129, 1)'
            : 'transparent',
          borderColor: todo.completed
            ? 'rgba(16, 185, 129, 1)'
            : 'rgba(63, 63, 70, 1)',
        }}
      >
        {todo.completed && <span style={styles.checkmark}>✓</span>}
      </button>

      <div style={styles.todoContent}>
        <span
          style={{
            ...styles.todoText,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'rgba(113, 113, 122, 1)' : 'white',
          }}
        >
          {todo.title}
        </span>
        <span style={styles.todoDate}>
          {new Date(todo.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        style={{
          ...styles.deleteButton,
          opacity: isHovered ? 1 : 0,
        }}
        aria-label="Delete todo"
      >
        🗑️
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.skeletonAvatar} />
          <div>
            <div style={{ ...styles.skeletonText, width: 200, height: 24 }} />
            <div
              style={{
                ...styles.skeletonText,
                width: 150,
                height: 16,
                marginTop: 8,
              }}
            />
          </div>
        </div>
      </div>
      <div style={styles.stats}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ ...styles.statCard, ...styles.skeletonCard }} />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcomeTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0,
  },
  email: {
    color: 'var(--text-secondary)',
    margin: 0,
    fontSize: '0.875rem',
  },
  settingsButton: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  statTitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    color: 'var(--text-primary)',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    margin: 0,
  },
  todoCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  todoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  todoTitle: {
    color: 'var(--text-primary)',
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: 0,
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
  },
  addForm: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  addInput: {
    flex: 1,
    backgroundColor: 'var(--toggle-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
  },
  addButton: {
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  filterTabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1rem',
  },
  filterTab: {
    padding: '0.5rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  errorMessage: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    color: 'rgba(239, 68, 68, 1)',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dismissError: {
    background: 'none',
    border: 'none',
    color: 'rgba(239, 68, 68, 1)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.15s',
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  checkmark: {
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  todoContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: 0,
  },
  todoText: {
    fontSize: '1rem',
    wordBreak: 'break-word',
  },
  todoDate: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.25rem',
    transition: 'opacity 0.15s',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem',
    color: 'var(--text-secondary)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--skeleton-bg)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  emptyTitle: {
    color: 'var(--text-primary)',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  emptySubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  tipsCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
  },
  tipsTitle: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
    marginBottom: '0.75rem',
  },
  tipsList: {
    margin: 0,
    paddingLeft: '1.25rem',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: 1.8,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'var(--skeleton-bg)',
  },
  skeletonText: {
    backgroundColor: 'var(--skeleton-bg)',
    borderRadius: '0.25rem',
  },
  skeletonCard: {
    height: '100px',
    backgroundColor: 'var(--skeleton-bg)',
  },
};
