import { AddDocBtn } from "@/components/AddDocBtn";
import { DeleteModal } from "@/components/DeleteModal";
import { Header } from "@/components/Header";
import { Notifications } from "@/components/Notifications";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect('/sign-in')

  const documents = await getDocuments(clerkUser.emailAddresses[0].emailAddress);
  return (
    <main className="home-container">
      <Header className=" sticky left-0 top-0" >
        <div className=" flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {documents.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">
              All documents
            </h3>
            <AddDocBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>

          <ul className="document-ul">
            {documents.data.map(({ id, metadata, createdAt }:
              {
                id: string,
                metadata: {
                  title : string,
                  creatorId? : string,
                  email? : string
                },
                createdAt : string
              }) => (
              <li key={id} className="document-list-item">
                <Link
                  href={`/documents/${id}`}
                  className=" flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src={"/assets/icons/doc.svg"}
                      alt="Document"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">
                      {metadata.title}
                    </p>
                    <p className=" tex-sm font-light text-blue-100">
                      Created about {dateConverter(createdAt)}
                    </p>
                  </div>
                </Link>
                <DeleteModal roomId={id} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className=" document-list-empty">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="Document"
            width={40}
            height={40}
          />

          <AddDocBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
}
