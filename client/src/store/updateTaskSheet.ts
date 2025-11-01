import { create } from 'zustand'

type State = {
    taskId: string | null,
}

type Actions = {
    setTaskId: (id: string) => void,
    resetState: () => void
}

export const useOpenTaskUpdate = create<State & Actions>((set) => ({
    taskId: null,
    setTaskId: (newState: string) => set(() => ({ taskId: newState })),
    resetState: () => set(() => ({ taskId: null })),
}))
