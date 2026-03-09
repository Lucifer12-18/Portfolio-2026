"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ProjectDetails {
    title: string
    file: string
    tags: string[]
    tools: string[]
    problem: string
    approach: string[]
    outcome: string
    imagePath?: string
}

interface ModalContextValue {
    project: ProjectDetails | null
    isOpen: boolean
    openModal: (project: ProjectDetails) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [project, setProject] = useState<ProjectDetails | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openModal = (p: ProjectDetails) => {
        setProject(p)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <ModalContext.Provider value={{ project, isOpen, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error("useModal must be used within ModalProvider")
    return ctx
}
