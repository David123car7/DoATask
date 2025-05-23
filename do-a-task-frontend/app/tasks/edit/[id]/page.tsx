"use server";

import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import EditTaskForm from "@/lib/components/layouts/forms/edit.tasks.form";
import { createClient } from "@/lib/utils/supabase/server";
import { getTaskSchema } from "@/lib/schemas/tasks/get-task-member-created";

export default async function EditTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch communities
  const communities = await GetUserCommunitiesNames();
  const communitiesValidated = getNameCommunitySchemaArray.parse(communities);

  // Fetch task data
  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  // Validate task data against schema
  const taskData = getTaskSchema.parse(task);

  return (
    <>
      <HeaderWrapper />
      <Toaster />
      <EditTaskForm communityData={communitiesValidated} taskData={taskData} />
      <Footer />
    </>
  );
}
