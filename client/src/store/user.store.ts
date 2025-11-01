import { UserRole, type profileDataType } from '@/types/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type stateType = {
    user: profileDataType
}

interface userStore extends stateType {
    user: profileDataType,
    setState: (newState: profileDataType) => void,
    updateState: (newState: Partial<profileDataType>) => void,
    resetState: () => void
}

const initialUserState: profileDataType = {
    id: 0,
    name: "",
    email: "",
    profileImgUrl: "",
    Oauth: false,
    bio: null,
    attachedLinks: "",
    editable: false,
    createdAt: "",
    role: UserRole.NORMAL,
    bannerImgUrl: "",
    videosUploaded: 0,
    rating: 0,
    tasksCompleted: 0,
}

export const useUserStore = create<userStore>()(
    persist(
        (set, _) => ({
            user: initialUserState,
            setState: (newState) => set(() => ({ user: newState })),
            updateState: (newState) => set((state) => ({ user: { ...state.user, ...newState } })),
            resetState: () => {
                set(() => ({ user: initialUserState }));
                localStorage.removeItem('user-storage');
            }
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)



