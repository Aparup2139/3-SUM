import { type TaskDataType } from '@/types/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface taskStore {
    tasks: Partial<TaskDataType>[],
    setState: (newState: Partial<TaskDataType>[]) => void,
    appendState: (newTask: Partial<TaskDataType>) => void,
    updateStateById: (taskId: number, updatedTask: Partial<TaskDataType>) => void,
    DeleteState: (taskId: number) => void,
    resetState: () => void,
}

export const useTaskStore = create<taskStore>()(
    persist(
        (set, _) => ({
            tasks: [],
            setState: (newState) => set(() => ({ tasks: newState })),
            appendState: (newTask) => set((state) => ({ tasks: [newTask, ...state.tasks] })),
            DeleteState: (taskId) => set((state) => ({ tasks: state.tasks.filter(task => task.id !== taskId) })),
            resetState: () => {
                set(() => ({ tasks: [] }));
                localStorage.removeItem('task-storage');
            },
            updateStateById: (taskId, updatedTask) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task.id === taskId ? { ...task, ...updatedTask } : task
                ),
            })),
        }),
        {
            name: 'task-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)



