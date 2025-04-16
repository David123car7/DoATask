'use server'; // Mark this as a Client Component

import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import Footer from '@/lib/components/layouts/footer/page';
import CreateCommunityForm from '@/lib/components/layouts/forms/create.community.form';

export default async function CreateCommunityPage() {

  
  return (
    <>
      <HeaderWrapper/>
      <CreateCommunityForm/>
      <Footer/>
    </>
  );
}