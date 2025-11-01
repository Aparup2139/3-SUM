import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
    taskId: number | null;
};

type Actions = {
    setTaskId: (id: number) => void;
    resetState: () => void;
};

export const useUploadVideo = create<State & Actions>()(
    persist(
        (set) => ({
            taskId: null,
            setTaskId: (id: number) => set(() => ({ taskId: id })),
            resetState: () => {
                set(() => ({ taskId: null }));
                localStorage.removeItem('upload-video-storage');
            },
        }),
        {
            name: 'upload-video-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
