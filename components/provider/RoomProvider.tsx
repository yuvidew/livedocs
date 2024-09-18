"use client"

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Loader } from "../Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";

export const RoomProviderComp = ({
    children
}: { children: ReactNode }) => {
    const { user: clerkUser } = useUser();
    return (
        <LiveblocksProvider 
            authEndpoint={'/api/liveblocks-auth'}
            resolveUsers={async ({ userIds}) => {
                return await getClerkUsers({userIds})
            }}
            // this is help to identify which user are which rooms
            resolveMentionSuggestions={async({text , roomId}) => {
                return await getDocumentUsers({
                    roomId , 
                    text , 
                    currentUser: clerkUser?.emailAddresses[0].emailAddress!
                })
            }}
        >
            {/* <RoomProvider id="my-room"> */}
                <ClientSideSuspense fallback={<Loader/>}>
                    {children}
                </ClientSideSuspense>
            {/* </RoomProvider> */}
        </LiveblocksProvider>

    )
}
