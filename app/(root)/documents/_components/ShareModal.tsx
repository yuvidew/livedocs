'use client'

import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserTypeSelector } from "./UserTypeSelector";
import { Collaborator } from "./Collaborator";
import { useSelf } from "@liveblocks/react/suspense";
import { updateDocumentAccess } from "@/lib/actions/room.actions";


export const ShareModal = ({
    roomId,
    collaborators,
    creatorId,
    currentUserType,
}: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<UserType>("viewer");

    // shareDocumentHandler
    const onShareDoc = async () => {
        setLoading(true);

        await updateDocumentAccess({
            roomId,
            email,
            userType: userType as UserType,
            updatedBy: user.info
        });

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className=" gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== "editor"}>
                    <Image
                        src={"/assets/icons/share.svg"}
                        alt='share'
                        width={20}
                        height={20}
                        className='min-h-4 md:size-5'
                    />
                    <p className="mr-1 hidden sm:block">
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>
                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className="mt-6 text-blue-100">
                    Email address
                </Label>
                <div className="flex items-center gap-3 w-full">
                    <div className="flex rounded-md bg-dark-400 w-full">
                        <Input
                            id="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="share-input w-full"
                        />
                        <UserTypeSelector
                            userType={userType}
                            setUserType={setUserType}
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={onShareDoc}
                        disabled={loading}
                        className="gradient-blue flex h-full gap-1 px-5"
                    >
                        {loading ? "Sending..." : "Invite"}
                    </Button>

                </div>
                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {collaborators.map((collaborator) => (
                            <Collaborator
                                key={collaborator.id}
                                roomId={roomId}
                                creatorId={creatorId}
                                email={collaborator.email}
                                collaborator={collaborator}
                                user={user.info}
                            />
                        ))}
                    </ul>
                </div>

            </DialogContent>
        </Dialog>
    )
}
