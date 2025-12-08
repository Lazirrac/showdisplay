import React, { useEffect, useState } from 'react'
import { MediaFile } from '../../utils/electron'

export default function MediaLibrary() {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'audio' | 'text' | 'other'>('all')

    const fetchFiles = async () => {
        if (!window.electron) return
        setLoading(true)
        try {
            const type = (activeTab === 'all' || activeTab === 'text' || activeTab === 'other') ? undefined : activeTab
            const result = await window.electron.mediaList(type)
            if (result.success) {
                setFiles(result.files)
            }
        } catch (error) {
            console.error('Failed to fetch media:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [activeTab])

    const handleAddMedia = async () => {
        if (!window.electron) return
        const result = await window.electron.mediaAddFiles()
        if (result.success) {
            fetchFiles()
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        if (!window.electron) return
        if (confirm('Are you sure you want to delete this file?')) {
            await window.electron.mediaDelete(id)
            fetchFiles()
        }
    }

    const handleDragStart = (e: React.DragEvent, file: MediaFile) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'MEDIA_FILE',
            mediaId: file.id,
            mediaType: file.type,
            file: file
        }))
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
            <div className="flex gap-2 p-2 bg-slate-900 border-b border-slate-800 overflow-x-auto justify-between items-center">
                <div className="flex gap-1">
                    {(['all', 'video', 'image', 'audio', 'text', 'other'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 rounded text-xs capitalize transition-colors ${activeTab === tab
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleAddMedia}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors whitespace-nowrap"
                >
                    Add Media
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-6 gap-2">
                    {/* Virtual Items: Text & Timer */}
                    {(activeTab === 'all' || activeTab === 'text') && (
                        <div
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({
                                    type: 'TEXT_SOURCE'
                                }))
                                e.dataTransfer.effectAllowed = 'copy'
                            }}
                            className="group relative aspect-square bg-slate-800 rounded border border-slate-700 hover:border-blue-500 cursor-grab active:cursor-grabbing overflow-hidden flex flex-col items-center justify-center p-1"
                            title="Text Source"
                        >
                            <div className="text-slate-400 text-2xl font-bold">T</div>
                            <div className="w-full mt-1 px-1 absolute bottom-0 left-0 py-0.5 bg-slate-900/80">
                                <div className="text-[10px] text-white truncate text-center">Text</div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'all' || activeTab === 'other') && (
                        <div
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({
                                    type: 'TIMER_SOURCE'
                                }))
                                e.dataTransfer.effectAllowed = 'copy'
                            }}
                            className="group relative aspect-square bg-slate-800 rounded border border-slate-700 hover:border-blue-500 cursor-grab active:cursor-grabbing overflow-hidden flex flex-col items-center justify-center p-1"
                            title="Timer Source"
                        >
                            <div className="text-slate-400 text-2xl font-bold">⏱</div>
                            <div className="w-full mt-1 px-1 absolute bottom-0 left-0 py-0.5 bg-slate-900/80">
                                <div className="text-[10px] text-white truncate text-center">Timer</div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="col-span-6 text-center text-slate-500 py-4">Loading...</div>
                    ) : (
                        files.map((file) => (
                            <div
                                key={file.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, file)}
                                className="group relative aspect-square bg-slate-800 rounded border border-slate-700 hover:border-blue-500 cursor-grab active:cursor-grabbing overflow-hidden flex flex-col items-center justify-center p-1"
                                title={file.name}
                            >
                                {/* Thumbnail / Icon */}
                                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                                    {file.type === 'image' || (file.type === 'video' && file.thumbnail_path) ? (
                                        <img
                                            src={`file://${file.thumbnail_path || file.path}`}
                                            alt={file.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-slate-600 text-sm font-bold uppercase">
                                            {file.ext?.replace('.', '') || file.type}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="w-full mt-1 px-1 bg-slate-900/80 absolute bottom-0 left-0 py-0.5 transition-transform translate-y-full group-hover:translate-y-0">
                                    <div className="text-[10px] text-white truncate text-center">{file.name}</div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDelete(e, file.id)}
                                    className="absolute top-0.5 right-0.5 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
