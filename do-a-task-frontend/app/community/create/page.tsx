'use server'; // Mark this as a Client Component

import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import Footer from '@/lib/components/layouts/footer/page';
import CreateCommunityForm from '@/lib/components/layouts/forms/create.community.form';
import { Toaster } from '@/lib/components/layouts/toaster/toaster';
export default async function CreateCommunityPage() {

  
  return (
    <>
      <HeaderWrapper/>
      <Toaster/>
      <CreateCommunityForm/>
      <Footer/>
    </>
  );
}