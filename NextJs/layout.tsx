import * as React from 'react';

export async function generateMetadata({ params: { lng } }) {
  const messages = (await import(`../../i18n/locales/${lng}/meta-data.json`))
    .default;

  // return an object
  return {
    title: messages.adduser.metatitle,
    description: messages.adduser.metadescription,
  };
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
