'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteScript } from '@/app/editor/actions'
import { useRouter } from 'next/navigation'

export function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Are you sure you want to delete this script?')) return

        setIsDeleting(true)
        try {
            await deleteScript(id)
            router.refresh()
        } catch (error) {
            console.error('Failed to delete:', error)
            alert('Failed to delete script')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
            title="Delete script"
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    )
}
