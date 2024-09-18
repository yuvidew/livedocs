"use client"

import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Loader } from '../../../../../components/Loader'
import { Header } from '../../../../../components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '../../../../../components/ui/button'
import { Editor } from '../../../../../components/Editor/Editor'
import { ActiveCollaborators } from '../../../../../components/ui/ActiveCollaborators'
import { Input } from '../../../../../components/ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'
import { ShareModal } from '../../_components/ShareModal'

export const CollaborativeRome = ({
    roomId,
    roomMetadata,
    users, 
    currentUserType
}: CollaborativeRoomProps) => {
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            setLoading(true)
            try {
                if(documentTitle !== roomMetadata.title){
                    const updatedDocument = await updateDocument(roomId , documentTitle)

                    if(updatedDocument){
                        setEditing(false)
                    }
                }
            } catch (error) {
                console.error(error);
            }

            setLoading(false)
        }
    }

    useEffect(() => {
        const handleClickOutside = (e : MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                setEditing(false);
                updateDocument(roomId , documentTitle)
            }
        }

        document.addEventListener("mousedown" , handleClickOutside);

        return () => {
            document.removeEventListener("mousedown" , handleClickOutside);
        }
    } , [roomId , documentTitle])

    useEffect(() => {
        if(editing && inputRef.current){
            inputRef.current.focus()
        }
    } , [editing])

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className=' collaborative-room'>
                    <Header>
                        <div ref={containerRef} className=' flex w-fit items-center justify-center gap-2' >
                            {editing && !loading ? (
                                <Input
                                    type='text'
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder='Enter title'
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className='document-title-input'
                                />
                            ) : (
                                <>
                                    <p className=' document-title'>{documentTitle}</p>
                                </>
                            )}

                            {currentUserType === "editor" && !editing && (
                                <Image
                                    src={"/assets/icons/edit.svg"}
                                    alt='edit'
                                    width={24}
                                    height={24}
                                    onClick={() => setEditing(true)}
                                    className='pointer'
                                />
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className='view-only-tag'>
                                    View only
                                </p>
                            )}

                            {loading && <p className=' text-sm text-gray-400'>Saving...</p>}
                        </div>
                        <div className='flex w-full flex-1 justify-end gap-2'>
                            {(currentUserType !== undefined && users !== undefined )&& (
                                <ShareModal
                                roomId = {roomId}
                                collaborators = {users}
                                creatorId = {roomMetadata.creatorId}
                                currentUserType = {currentUserType}
                                />
                            )}
                            <ActiveCollaborators />
                            <SignedOut>
                                <Button variant={"ghost"} size={"sm"} >
                                    <SignInButton />
                                </Button>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    {currentUserType !== undefined && (
                        <Editor roomId = {roomId} currentUserType = {currentUserType} />
                    )}
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}
