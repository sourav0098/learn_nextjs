import getUserById from "@/lib/getUserById";
import getUserPosts from "@/lib/getUserPosts";
import { Suspense } from "react";
import { UserPosts } from "./components/UserPosts";
import type { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";
import { notFound } from "next/navigation";

type Params = {
  params: {
    userId: string;
  };
};

// dynamic metadata
export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUserById(userId);
  const user = await userData;

  if (!user?.name) {
    return {
      title: "User not found",
    };
  }

  return {
    title: user.name,
    description: `Posts by ${user.name}`,
  };
}

export default async function UserPage({ params: { userId } }: Params) {
  // Initiate both requests in parallel
  const userData: Promise<User> = getUserById(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);

  // const [user, userPosts] = await Promise.all([userData, userPostsData]);

  // wait for user promise to resolve
  const user = await userData;

  if (!user?.name) {
    return notFound();
  }

  return (
    <>
      {/* Show the user name first and wrap posts in a suspense boundry */}
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Async Server Component */}
        <UserPosts promise={userPostsData}></UserPosts>
      </Suspense>
    </>
  );
}

// The generateStaticParams function can be used in combination with dynamic route segments to statically generate routes at build time instead of on-demand at request time
export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers();
  const users = await usersData;

  return users.map((user) => {
    userId: user.id.toString();
  });
}
