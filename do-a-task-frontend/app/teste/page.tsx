"use server";

import Footer from '@/lib/components/layouts/footer/page';
import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';

export default async function Home() {

  return (
    <div className="page-auth">
      <HeaderWrapper/>
      <main></main>
      <Footer/>
    </div>
  );
}